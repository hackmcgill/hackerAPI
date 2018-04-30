FROM node:carbon

ENV PORT 8080

WORKDIR /usr/src/app

COPY package*.json ./
ADD VERSION .

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "debug" ]