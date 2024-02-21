FROM node:18.19.0

WORKDIR /usr/src/app

# Dont skip this step. It is for caching.
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npm run migrate

RUN npm run kasql-build

CMD ["npm", "start"]