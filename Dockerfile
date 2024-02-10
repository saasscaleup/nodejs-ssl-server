FROM node:alpine

WORKDIR /nodejs-ci-cd-pipeline

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]