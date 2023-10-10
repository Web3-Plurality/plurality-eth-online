FROM node:16
RUN apt-get update && apt-get -y install sudo
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn set version 3.2.1
COPY . /app
RUN yarn install
EXPOSE 8000
#CMD ["yarn", "start"]