#!/bin/sh
date=$(date '+%Y-%m-%d')

export DOCKER_HOST=ssh://192.168.10.10
docker images
docker save -o raspi-finance-react-${date}.tar raspi-finance-react

cp raspi-finance-react-${date}.tar /mnt/external/proxmox-backups/
rm raspi-finance-react-${date}.tar

echo docker load -i raspi-finance-react-${date}.tar
echo docker run -dit --restart unless-stopped -p 3000:443 --name raspi-finance-react -h raspi-finance-react raspi-finance-react

exit 0
