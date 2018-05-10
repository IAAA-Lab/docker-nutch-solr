FROM node:8-alpine

COPY yarn.lock /yarn.lock
COPY package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=${PATH}:${NODE_PATH}/.bin
RUN yarn

WORKDIR /app
COPY . /app

EXPOSE 3000
EXPOSE 35729

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
