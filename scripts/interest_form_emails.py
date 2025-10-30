#!/usr/bin/env python3
import os
import sys
import csv
import time
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

FROM_EMAIL = "contact@mchacks.ca"
TEMPLATE_ID = "d-8cbb9f9e07f04712bc88aecba33d49f3"


def send_email(to_email):

    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
    )
    message.template_id = TEMPLATE_ID

    try:
        sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))
        response = sg.send(message)
        return True
    except Exception as e:
        print(f"Error sending to {to_email}: {e}")
        return False


def parse_csv(csv_filename):
    if not os.path.exists(csv_filename):
        print(f"Error: File '{csv_filename}' not found")
        return

    sent_count = 0
    failed_count = 0

    try:
        with open(csv_filename, "r", newline="", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)

            for _, row in enumerate(reader, start=1):
                email = row.get("Email", "").strip()

                if not email or "@" not in email:
                    continue

                if send_email(email):
                    sent_count += 1
                else:
                    failed_count += 1

                time.sleep(0.1) # Add delay to avoid rate limiting

            print(f"\nSent: {sent_count} | Failed: {failed_count}")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    parse_csv(sys.argv[1])
