FROM node:16.17 AS compiler
WORKDIR /
COPY package.json package-lock.json ./
COPY ./src ./src
RUN npm install