FROM node:slim

WORKDIR /app

COPY package.json .

COPY * .

RUN npm install --silent

EXPOSE 3000

ENTRYPOINT [ "npm", "start"]