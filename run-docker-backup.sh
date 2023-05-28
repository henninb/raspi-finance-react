#!/bin/sh
date=$(date '+%Y-%m-%d')

docker save -o raspi-finance-react-${date}.tar raspi-finance-react

echo docker load -i raspi-finance-react-${date}.tar

scp raspi-finance-react-${date}.tar henninb@192.168.10.10:/home/henninb

echo docker run -dit --restart unless-stopped -p 3000:443 --name raspi-finance-react -h raspi-finance-react raspi-finance-react

exit 0
