#!/usr/bin/env python3
import argparse
import os
import tempfile
import zipfile
from urllib.parse import quote_plus

from dotenv import load_dotenv
from google.cloud import storage
from google.oauth2 import service_account
from bson import ObjectId
from pymongo import MongoClient


def build_mongo_uri(address: str, username: str, password: str) -> str:
    address = address.strip()
    if address.startswith("mongodb://") or address.startswith("mongodb+srv://"):
        return address
    if "@" in address:
        return f"mongodb://{address}"
    user = quote_plus(username)
    pwd = quote_plus(password)
    return f"mongodb://{user}:{pwd}@{address}"


def guess_extension(content_type: str) -> str:
    if not content_type:
        return ""
    mapping = {
        "application/pdf": ".pdf",
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
        "image/png": ".png",
        "image/jpeg": ".jpg",
    }
    return mapping.get(content_type, "")


def safe_name(value: str) -> str:
    cleaned = "".join(
        ch for ch in value.strip() if ch.isalnum() or ch in ("-", "_")
    )
    return cleaned or "unknown"


def main() -> int:
    load_dotenv(override=True)
    parser = argparse.ArgumentParser(
        description="Download all hacker resumes from GCS and bundle into a zip."
    )
    parser.add_argument(
        "--out",
        default="resumes.zip",
        help="Output zip path (default: resumes.zip).",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable verbose logging for troubleshooting.",
    )
    args = parser.parse_args()

    address = os.environ.get("DB_ADDRESS_DEPLOY")
    username = os.environ.get("DB_USER_DEPLOY")
    password = os.environ.get("DB_PASS_DEPLOY")
    bucket_name = os.environ.get("BUCKET_NAME")

    missing = [k for k, v in {
        "DB_ADDRESS_DEPLOY": address,
        "DB_USER_DEPLOY": username,
        "DB_PASS_DEPLOY": password,
        "BUCKET_NAME": bucket_name,
    }.items() if not v]
    if missing:
        raise SystemExit(f"Missing required env vars: {', '.join(missing)}")

    gcs_env = {
        "TYPE": os.environ.get("TYPE"),
        "PROJECT_ID": os.environ.get("PROJECT_ID"),
        "PRIVATE_KEY_ID": os.environ.get("PRIVATE_KEY_ID"),
        "PRIVATE_KEY": os.environ.get("PRIVATE_KEY"),
        "CLIENT_EMAIL": os.environ.get("CLIENT_EMAIL"),
        "CLIENT_ID": os.environ.get("CLIENT_ID"),
        "AUTH_URI": os.environ.get("AUTH_URI"),
        "TOKEN_URI": os.environ.get("TOKEN_URI"),
        "AUTH_PROVIDER_X509_CERT_URL": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
        "CLIENT_X509_CERT_URL": os.environ.get("CLIENT_X509_CERT_URL"),
    }
    missing_gcs = [k for k, v in gcs_env.items() if not v]
    if missing_gcs:
        raise SystemExit(f"Missing required GCS env vars: {', '.join(missing_gcs)}")

    mongo_uri = build_mongo_uri(address, username, password)
    if args.debug:
        print(f"Mongo URI: {mongo_uri}")
    client = MongoClient(mongo_uri)
    db_name = "hackboard-deploy"
    db = client[db_name]
    hackers = db["hackers"]
    accounts = db["accounts"]
    account_cache = {}
    if args.debug:
        print(f"Database: {db_name}")
        print(f"Collections: {', '.join(sorted(db.list_collection_names()))}")
        print(f"Hackers count: {hackers.count_documents({})}")

    query = {"application.general.URL.resume": {"$exists": True, "$ne": ""}}
    projection = {"application.general.URL.resume": 1, "accountId": 1}
    cursor = hackers.find(query, projection=projection)
    if args.debug:
        match_count = hackers.count_documents(query)
        print(f"Resume query matches: {match_count}")

    private_key = gcs_env["PRIVATE_KEY"]
    if private_key and "\\n" in private_key:
        private_key = private_key.replace("\\n", "\n")

    credentials_info = {
        "type": gcs_env["TYPE"],
        "project_id": gcs_env["PROJECT_ID"],
        "private_key_id": gcs_env["PRIVATE_KEY_ID"],
        "private_key": private_key,
        "client_email": gcs_env["CLIENT_EMAIL"],
        "client_id": gcs_env["CLIENT_ID"],
        "auth_uri": gcs_env["AUTH_URI"],
        "token_uri": gcs_env["TOKEN_URI"],
        "auth_provider_x509_cert_url": gcs_env["AUTH_PROVIDER_X509_CERT_URL"],
        "client_x509_cert_url": gcs_env["CLIENT_X509_CERT_URL"],
    }
    credentials = service_account.Credentials.from_service_account_info(
        credentials_info
    )
    storage_client = storage.Client(
        project=credentials_info["project_id"], credentials=credentials
    )
    bucket = storage_client.bucket(bucket_name)

    total = 0
    downloaded = 0
    with tempfile.TemporaryDirectory() as tmpdir:
        for doc in cursor:
            total += 1
            resume_path = (
                doc.get("application", {})
                .get("general", {})
                .get("URL", {})
                .get("resume", "")
            )
            if not resume_path:
                if args.debug:
                    print(f"Skip {doc.get('_id')}: missing resume path")
                continue

            blob = bucket.blob(resume_path)
            if not blob.exists():
                if args.debug:
                    print(f"Missing blob: {resume_path}")
                continue

            account_id = doc.get("accountId")
            if isinstance(account_id, dict) and "$oid" in account_id:
                account_id = account_id["$oid"]
            if isinstance(account_id, str):
                try:
                    account_id = ObjectId(account_id)
                except Exception:
                    pass
            account = {}
            if account_id in account_cache:
                account = account_cache[account_id]
            elif account_id is not None:
                account = accounts.find_one({"_id": account_id}) or {}
                if not account and isinstance(account_id, ObjectId):
                    account = (
                        accounts.find_one({"_id": str(account_id)}) or {}
                    )
                account_cache[account_id] = account

            first = safe_name(str(account.get("firstName", "")))
            last = safe_name(str(account.get("lastName", "")))

            if args.debug:
                print("Names: ", first, last)
                
            if first == "unknown" and last == "unknown":
                name_stub = str(doc["_id"])
            else:
                name_stub = f"{first}_{last}"

            basename = os.path.basename(resume_path)
            ext = os.path.splitext(basename)[1]
            if not ext:
                blob.reload()
                ext = guess_extension(blob.content_type)

            local_name = (
                f"{name_stub}_resume{ext if ext else ''}"
                if name_stub != str(doc["_id"])
                else f"{doc['_id']}__{basename}{ext if ext else ''}"
            )
            local_path = os.path.join(tmpdir, local_name)

            if args.debug:
                print(f"Downloading {resume_path} -> {local_name}")
            with open(local_path, "wb") as fh:
                fh.write(blob.download_as_bytes())
            downloaded += 1

        with zipfile.ZipFile(args.out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
            for name in os.listdir(tmpdir):
                path = os.path.join(tmpdir, name)
                zf.write(path, arcname=name)

    print(f"Processed {total} hackers, downloaded {downloaded} resumes.")
    print(f"Wrote {args.out}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
