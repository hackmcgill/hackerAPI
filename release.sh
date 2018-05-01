#!/usr/bin/env bash
set -e
# Variables
GCR=gcr.io
PROJECT=hackboard6
IMAGE=hackboard
MODE=$1

BRANCH="$(git symbolic-ref HEAD 2>/dev/null)" || BRANCH="(unnamed branch)"     # detached HEAD
BRANCH=${BRANCH##refs/heads/}

echo "Welcome to Hackboard's HackerAPI Deployment Script!"
echo "==================================================="

# Only allow release on master branch

if [ ! ${BRANCH} = "master" ]; then
    echo "Current branch: ${BRANCH}"
    echo "ERROR: Release operation is only available on master branch."
    echo "Deployment failed. Exiting."
    exit 1
fi
echo "Release modes:"
PS3='Please select one of the above release version modes:'
options=("Patch" "Minor" "Major" "Quit")
select opt in "${options[@]}"
do
    case ${opt} in
	"Patch")
	    MODE=patch
	    break
	    ;;
	"Minor")
	    MODE=minor
	    break
	    ;;
	"Major")
	    MODE=major
	    break
	    ;;
	"Quit")
	    echo "Deployment cancelled. Exiting."
	    exit 1
	    ;;
	*) echo "Invalid option";;
    esac
done

# Update current branch
git pull origin master

# bump version
docker run --rm -v "$PWD":/app treeder/bump ${MODE}
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
