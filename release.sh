#!/usr/bin/env bash

# Variables
GCR=gcr.io
PROJECT=hackboard6
IMAGE=hackboard

BRANCH="$(git symbolic-ref HEAD 2>/dev/null)" || BRANCH="(unnamed branch)"     # detached HEAD
BRANCH=${BRANCH##refs/heads/}

if [ ! ${BRANCH} = "master" ]; then
    echo "Current branch: ${BRANCH}"
    echo "Release operation is only available on master branch..."
    exit 1
fi

# Update current branch
git pull origin master

# bump version
docker run --rm -v "$PWD":/app treeder/bump minor
version=`cat VERSION`
echo "Version: ${version}"

# Build
./build.sh

# Tag Github
git add -A
git commit -m "version ${version}"
git tag -a "${version}" -m "version ${version}"
git push origin master
git push origin master --tags

# Update the image tags
docker tag ${GCR}/${PROJECT}/${IMAGE}:latest ${GCR}/${PROJECT}/${IMAGE}:${version}

# Push to docker repo on g-cloud
docker push ${GCR}/${PROJECT}/${IMAGE}:latest
docker push ${GCR}/${PROJECT}/${IMAGE}:${version}

# Update deployment
kubectl set image deployment/hackboard hackboard=${GCR}/${PROJECT}/${IMAGE}:latest