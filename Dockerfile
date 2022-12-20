FROM node:18.3.0 as development

WORKDIR /usr/src/cryptodistrict_api

RUN npm i -g nest

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

