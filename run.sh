#!/bin/sh

date=$(date '+%Y-%m-%d')
ENV=$1
APP=raspi-finance-react
# export NODE_OPTIONS=--openssl-legacy-provider
export BROWSER=browser-start

if [ $# -ne 1 ]; then
  echo "Usage: $0 <prod|dev>"
  exit 1
fi

if [ "$ENV" = "prod" ] || [ "$ENV" = "dev" ]; then
  echo "${ENV}"
else
  echo "Usage: $0 <prod|dev>"
  exit 2
fi

HOST_IP=192.168.10.10

export HOST_IP
export CURRENT_UID="$(id -u)"
export CURRENT_GID="$(id -g)"

echo HOST_IP=$HOST_IP

mkdir -p ssl
rm -rf build

echo npm run build
if [ "$ENV" = "prod" ]; then
  if ! npm run build; then
    echo "npm build failed"
    exit 1
  fi

  echo docker
  export DOCKER_HOST=ssh://$HOST_IP
  docker stop raspi-finance-react
  docker rm -f raspi-finance-react
  docker rmi raspi-finance-react
  docker rmi -f $(docker images -q -f dangling=true)

  if ! docker compose -f docker-compose.yml up -d; then
    echo "docker-compose up failed."
    exit 1
  fi
  docker ps -a
  # docker save -o raspi-finance-react-docker-${date}.tar raspi-finance-react:latest
  # echo docker exec -it raspi-finance-react /bin/sh
else
  echo npx npm-check-updates -u
  echo npx depcheck
  npm install
  npm run prettier
  npm test
  NODE_OPTIONS=--openssl-legacy-provider yarn start
fi

exit 0
