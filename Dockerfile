FROM node:12-alpine

RUN mkdir -p /app

ADD ./package.json /app/package.json

ADD ./package-lock.json /app/package-lock.json

WORKDIR /app

RUN npm install --production

ADD ./ /app/

CMD [ "npm", "start" ]