FROM nginx:1.13-alpine

COPY nist-data/*.gz /usr/share/nginx/html/

CMD cd /usr/share/nginx/html/ && gzip -k -d *.gz && nginx -g 'daemon off;'