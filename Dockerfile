FROM node:carbon

ENV PORT 8080

WORKDIR /usr/src/app

COPY package*.json ./
ADD VERSION .

RUN npm install -g n
RUN n 9.9.0
RUN npm install npm -g
RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "debug" ]