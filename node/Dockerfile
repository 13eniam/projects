FROM node:0.10.33
MAINTAINER Beniam Haile
LABEL "use"="Node Testing environment"
USER root
ENV APP /app

#Application Code
ADD package.json $APP/
ADD target $APP/target

WORKDIR $APP

RUN npm install
