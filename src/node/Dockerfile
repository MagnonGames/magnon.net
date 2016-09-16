FROM mhart/alpine-node:6

ENV NODE_ENV production
WORKDIR /usr/src

ADD src/ .

EXPOSE 80

RUN npm install
CMD ["node","server.js"]
