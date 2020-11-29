FROM nginx:1.19.5-alpine

RUN mkdir -p /opt/ssl
COPY ./ssl /opt/ssl
# ENV REACT_APP_ENDPOINT_SERVER=hornsup
# ENV REACT_APP_ENDPOINT_PORT=8080
# ENV REACT_APP_ENDPOINT_SSL_ENABLED=true
# # ENV HTTPS=true
# ENV SSL_CRT_FILE=/opt/ssl/hornsup-raspi-finance-cert.pem
# ENV SSL_KEY_FILE=/opt/ssl/hornsup-raspi-finance-key.pem
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY ./build /usr/share/nginx/html
