FROM node:12-alpine

RUN mkdir /
COPY ./ /
WORKDIR /
RUN npm install

ENTRYPOINT [ "sh", "-c", "node /app.js" ]
