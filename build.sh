#!/usr/bin/env bash

set -ex
GCR=gcr.io
PROJECT=hackboard6
IMAGE=hackboard

docker build -t ${GCR}/${PROJECT}/${IMAGE}:latest .