FROM node:16
RUN mkdir /app
WORKDIR /app
COPY package.json /app
#COPY package-lock.json /app
RUN yarn install
COPY . /app
EXPOSE 8000
CMD ["yarn", "start"]