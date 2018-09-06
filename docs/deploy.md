# How to deploy

The following document acts as a quickstart guide on how to get your machine set up for deployment to the Google Cloud Container Cluster we have set up for the project.
*** Please note that the very first step before performing any of the steps below is to get permission from** @Kyle Rubenok **to be added to the Google Cloud project.
** The steps below are written with an Ubuntu OS in mind, however a Mac OS should also be able to perform the majority (if not all) of this given the UNIX environment.**

## Installing Google Cloud SDK

We begin by installing the Google Cloud CLI so we can easily deploy the application directly from the command line. Head over to [this link](https://cloud.google.com/sdk/) and click on the "Install for [OS]" button.

## Setting up Google Cloud SDK

Once you have the SDK installed, you can head over to your terminal and type in `gcloud init`  to get started with the initial configuration of the SDK. This process is fairly intuitive and it takes you through a few steps to get your Google account linked to the CLI by logging into the web interface, as well as choosing a default project. **Note that it's a good idea to have your Google account already added to the project on Google Cloud by someone who has access before doing this, so that you can just select the hackboard project as your default instead of re-setting it later.**
In any case, we will be covering what commands you need to set our project as your default project. Type in the following lines in your terminal.

```bash
    > gcloud config set project hackboard6
    > gcloud config set compute/zone us-east1-b
```

## Installing Kubernetes

Kubernetes is essentially Google's answer to efficient cloud clustering and scaling. We'll use both Kubernetes and Docker here. Kubernetes is essentially what we will use to manage our cluster of nodes that will run the application and allow us to scale it efficiently and easily. We get into the Docker details later. We will **not** be installing Kubernetes through the official installer, but rather use `gcloud` CLI to install it such that it automatically integrates with your credentials and save us some time setting it up. Run the following in your terminal.

```bash
    > gcloud components install kubectl
```

Hopefully you'll manage to walk through the simple setup quickly and have it up and running. The next step would be creating a cluster and setting it up with your application, but since we have already taken care of that, you'll want to run the below command to have your CLI connected to the cluster we have already created so that you can deploy to it. This command will attempt to retrieve the credentials for the 'hackboard' cluster we have set up and allow you to deploy to it.

```bash
    > gcloud container clusters get-credentials hackboard
```

## Intalling Docker CE

We will be using the Community Edition of Docker for our application. Head over to [this link](https://www.docker.com/community-edition#download) and choose and specific installation for your own operating system; the setup is rather intuitive and skipped in this guide. Once you've got Docker installed, try running `docker —version` to make sure it's up and running. Note that docker has a 'daemon' service which should be running for the CLI to communicate with. I suggest following the steps in [this page](https://docs.docker.com/install/linux/linux-postinstall/#configure-docker-to-start-on-boot) to make sure the daemon is configured to start with your machine on start-up. Also, the previously mentioned note is mostly directed towards Linux users; the Windows and MacOS application (I believe) takes care of starting up the daemon for you once you see the green light in your indicators.

**NOTE**: **The following steps are optional and meant for you to understand how the deployment actually works. You will not have to (and it is not recommended) to run all these steps manually everytime, as there will be a bash script setup to take care of all this.**

## Building the Docker Image

Every Docker container requires an image to run, which in turn requires a 'Dockerfile' as a set of instructions for creating it. Images can extend off of other images or be created from scratch. Due to the fact that the Docker community is very well established and has an 'almost' exhaustive list of base images on it already, we will be using an official Node JS image that provides the runtime for our application to run, and add to it as we wish. Below is the basic Dockerfile we have created so far:

```bash
    FROM node:carbon
    ENV PORT 8080
    WORKDIR /usr/src/app
    COPY package*.json ./
    ADD VERSION .
    RUN npm install
    COPY . .
    EXPOSE 8080
    CMD [ "npm", "start" ]
```

*If you have any questions regarding what Docker is and the difference between an image and a container, or anything else, I suggest reading online about it in detail before getting your hands dirty.*
To explain what is happening here, we are extending off of the LTS (carbon) version of the official Node image available on [Docker Hub](https://hub.docker.com/). Next we create an environment variable called PORT for our application. Environment variables can be created like this, or all added in a separate file. Next we declare the path `/usr/src/app` to be working directory (i.e. starting directory) of our image. Any operations from here onwards in the Dockerfile are performed in the set working directory. We will also copy the `package.json` files and the `VERSION` file with each build to make it easier to figure out which build is live via the application itself. Next we run the `npm install` command to install all dependencies, copy everything else left to copy to the image, and mark port `8080` to be exposed. This is an arbitrary value for now and can be replaced with any other port desired. Finally, set `npm start` as the starting command of the application which corresponds to `node ./bin/www` in our `package.json` file; this pretty much fires up the backend server.

To be able to push the docker image into the Google Cloud Container Registry so that our clusters can access the images easily, we first need a defined naming/tagging scheme for the images. Below is the scheme we are using (which is the default and recommended way of naming images on Container Registry). The host name for Google Cloud Container Registry is `[gcr.io](http://gcr.io)` , our project-ID is `hackboard6` , image name is `hackboard` and the tag will correspond to the version of the current build `6.x.x` which we will also have it programatically increment and synchronize with every release on the master branch on GitHub.

    [HOSTNAME]/[PROJECT-ID]/[IMAGE][:TAG|@DIGEST] #template
    gcr.io/hackboard6/hackboard:latest #example

Every image has a `latest` version as well as all the other versions it was tagged as. The `latest` tag is automatically applied to (obviously) the latest build of the image, while the legacy builds are accessible via their specific version numbers.

First you want to make sure there are no changes pushed to the master branch by anyone else before you deploy your local version. So perform a `git pull origin master`.

We will first increment our `VERSION` file using a 3rd-party Docker image.

*TO BE CONTINUED WHEN I HAVE THE MOOD.*