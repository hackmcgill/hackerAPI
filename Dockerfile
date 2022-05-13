FROM node:latest

WORKDIR /application/

ADD . /application/

RUN npm ci

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
