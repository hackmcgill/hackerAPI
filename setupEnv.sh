#!/bin/bash

# Some of this was taken from https://gist.github.com/phatblat/1713458

NPM_VERSION=6.4.0
NODE_VERSION=`cat .nvmrc`
# Save script's current directory
DIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#
# Check if Homebrew is installed
#
which -s brew
if [[ $? != 0 ]] ; then
    # Install Homebrew
    # https://github.com/mxcl/homebrew/wiki/installation
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
    brew update
fi

#
# Check if Git is installed
#
which -s git || brew install git

#
# Check if Node is installed and at the right version
#
echo "Checking for Node version ${NODE_VERSION}"
node --version | grep ${NODE_VERSION}
if [[ $? != 0 ]] ; then
    # Install Node
    cd `brew --prefix`
    $(brew versions node | grep ${NODE_VERSION} | cut -c 16- -)
    brew install node

    # Reset Homebrew formulae versions
    git reset HEAD `brew --repository` && git checkout -- `brew --repository`
fi

cd /tmp

#
# Check if Node Package Manager is installed and at the right version
#
echo "Checking for NPM version ${NPM_VERSION}"
npm --version || grep ${NPM_VERSION}
if [[ $? != 0 ]] ; then
    echo "Downloading npm"
    git clone git://github.com/isaacs/npm.git && cd npm
    git checkout v${NPM_VERSION}
    make install
fi

#
# MongoDB
#

if brew ls --versions mongo > /dev/null; then
  # The package is installed!
  echo "Mongo already installed."
else
  # The package is not installed
  brew install mongodb
  mkdir -p /data/db
  echo 'Setting up proper permissions for /data/db. Please enter password.'
  sudo chown -R `id -un` /data/db
fi

if brew ls --versions docker > /dev/null; then
  # The package is installed!
  echo "Docker already installed."
else
  # The package is not installed
  echo "Installing Docker..."
  curl -fsSL get.docker.com -o ${DIR}/get-docker.sh
  sh get-docker.sh
fi

#
# Kubectl
#
if brew ls --versions kubernetes-cli > /dev/null; then
  # The package is installed!
  echo "kubernetes-cli already installed."
else
  # The package is not installed
  echo "Installing kubernetes-cli..."
  brew install kubernetes-cli
fi

#
# gcloud
#
which -s gcloud
if [[ $? != 0 ]]; then
  # The package is not installed
  echo "Installing gcloud..."
  brew tap caskroom/cask
  brew cask install google-cloud-sdk
else
  # The package is installed!
  echo "gcloud already installed."
fi