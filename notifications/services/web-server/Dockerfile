#Docker file for nginx
FROM nginx:1.11-alpine

ENV CONF /etc/nginx
ENV APP /usr/src/app

VOLUME ${APP}

ADD nginx.conf ${CONF}

EXPOSE 8080