#!/usr/bin/env bash
set -e
# Variables
GCR=gcr.io
PROJECT=hackboard6
IMAGE=hackboard
MODE=$1

BRANCH="$(git symbolic-ref HEAD 2>/dev/null)" || BRANCH="(unnamed branch)"     # detached HEAD
BRANCH=${BRANCH##refs/heads/}

if [ -z "${MODE}" ]; then
    echo "Error: Expected a mode as first argument!"
    echo "Options: "
    echo "	* patch"
    echo "	* minor"
    echo "	* major"
    echo "Please try again."
    exit 1
fi

if [ ! ${MODE} = "patch" && ! ${MODE} = "minor" && ! ${MODE} = "major" ]; then
    echo "Error: Expected one of the following modes:"
    echo "	* patch"
    echo "	* minor"
    echo "	* major"
    exit 1
fi

# Only allow release on master branch

if [ ! ${BRANCH} = "master" ]; then
    echo "Current branch: ${BRANCH}"
    echo "Release operation is only available on master branch..."
    exit 1
fi

# Update current branch
git pull origin master

# bump version
docker run --rm -v "$PWD":/app treeder/bump patch
version=`cat VERSION`
echo "Version: ${version}"

# Build Docker image
./build.sh

# Tag Github
git add -A
git commit -m "version ${version}"
git tag -a "${version}" -m "version ${version}"
git push origin master
git push origin master --tags

# Update the image tags
docker tag ${GCR}/${PROJECT}/${IMAGE}:latest ${GCR}/${PROJECT}/${IMAGE}:${version}

# Push to Docker Container Registry on Google Cloud
docker push ${GCR}/${PROJECT}/${IMAGE}:latest
docker push ${GCR}/${PROJECT}/${IMAGE}:${version}

# Update deployment image on Kubernetes cluster
kubectl set image deployment/hackboard hackboard=${GCR}/${PROJECT}/${IMAGE}:${version}
