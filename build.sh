#!/usr/bin/env bash

set -ex
GCR=gcr.io
PROJECT=mchacks-api
IMAGE=hackboard

docker build -t ${GCR}/${PROJECT}/${IMAGE}:latest .