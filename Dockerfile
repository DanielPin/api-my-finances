FROM node:20.11.0

RUN npm install -g @nestjs/cli
RUN npm install -g pnpm

USER node

WORKDIR /home/node/app