#!/bin/bash

# Some of this was taken from https://gist.github.com/phatblat/1713458

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
curDir=$PWD
cd /tmp

cd $curDir

#
# MongoDB
#

if brew ls --versions postgres > /dev/null; then
  # The package is installed!
  echo "PostgreSQL already installed."
else
  # The package is not installed
  echo "Installing PostgreSQL..."
  brew install postgres
fi

#
# Create .env file
#
if [ ! -f ./.env ]; then
    echo "Creating .env file. IMPORTANT: YOU MUST FILL THIS STUFF IN!"
    cp ./.env.example ./.env
else 
  echo ".env file already created."
fi

#
# NPM install
#
echo "installing npm modules."
npm install
