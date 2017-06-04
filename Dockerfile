FROM nginx:alpine

COPY ./nginx /etc/nginx
COPY ./out /var/www/magnon.net

RUN chmod 755 /var/www/*
