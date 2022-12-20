FROM node:18.3.0 as development

WORKDIR /usr/src/cryptodistrict_api

RUN npm i -g nest

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --force

COPY . .

ENV NODE_ENV=development

RUN npm run prisma:generate
RUN npm run build
