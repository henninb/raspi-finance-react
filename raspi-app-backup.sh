#!/bin/sh

echo docker save -o raspi-finance-react-docker.tar raspi-finance-react:latest
echo scp raspi-finance-react-docker.tar pi:/home/pi
echo docker load -i raspi-finance-react-docker.tar
echo docker run -it -h raspi-finance-react --add-host hornsup:192.168.100.124 -p 3000:443 --rm --name raspi-finance-react raspi-finance-react

echo zip -r raspi-finance-react.zip build/*
ssh pi mkdir -p /home/pi/projects/raspi-finance-react/build
scp raspi-finance-react.zip pi:/home/pi/projects/raspi-finance-react
ssh pi "cd /home/pi/projects/raspi-finance-react && unzip -o raspi-finance-react.zip && rm raspi-finance-react.zip"
# scp Dockerfile pi:/home/pi/raspi-finance-react
# scp ssl/* pi:/home/pi/raspi-finance-react/ssl
# ssh pi 

exit 0
