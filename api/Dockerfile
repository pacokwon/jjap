FROM node:13-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json /app/

RUN npm install && mv /app/node_modules /node_modules

COPY . /app/

EXPOSE 8000

CMD [ "nodemon", "index.js" ]
