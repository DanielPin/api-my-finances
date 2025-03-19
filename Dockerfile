FROM node:22.13.1

RUN npm install -g pnpm

USER node

WORKDIR /home/node/app