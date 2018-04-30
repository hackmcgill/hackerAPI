#!/usr/bin/env bash

set -ex

GCR=gcr.io
PROJECT=hackboard6
IMAGE=hackboard

# Update current branch
git pull origin development

# bump version
docker run --rm -v "$PWD":/app treeder/bump patch
version=`cat VERSION`
echo "Version: ${version}"

# Build
./build.sh

# Tag Github
git add -A
git commit -m "version ${version}"
git tag -a "${version}" -m "version ${version}"
git push origin development
git push origin development --tags

# Update the image tags
docker tag ${GCR}/${PROJECT}/${IMAGE}:latest ${GCR}/${PROJECT}/${IMAGE}:${version}

# Push to docker repo on g-cloud
docker push ${GCR}/${PROJECT}/${IMAGE}:latest
docker push ${GCR}/${PROJECT}/${IMAGE}:${version}

# Update deployment
kubectl set image deployment/hackboard hackboard=${GCR}/${PROJECT}/${IMAGE}:latest