FROM node:13-alpine

EXPOSE 8081
WORKDIR /app
COPY package*.json ./
RUN npm install

CMD ["npm", "run", "dev"]
