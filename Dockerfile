FROM nginx:1.13-alpine

COPY mirror/*.gz /usr/share/nginx/html/

CMD cd /usr/share/nginx/html/ && gzip -d *.gz && nginx -g 'daemon off;'