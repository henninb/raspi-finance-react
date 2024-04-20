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

if [ ! -x "$(command -v ./os-env)" ]; then
  echo "./os-env is need to set the environment variable OS."
  exit 3
fi

. ./os-env

# "$OSTYPE" == "darwin"*
if [ "$OS" = "Linux Mint" ] || [ "$OS" = "Ubuntu" ] || [ "$OS" = "Debian GNU/Linux" ]; then
  echo "System limit for number of file watchers reached"
  #echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Arch Linux" ] || [ "$OS" = "ArcoLinux" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "openSUSE Tumbleweed" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Solus" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Fedora" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Darwin" ]; then
  HOST_IP=$(ipconfig getifaddr en0)
elif [ "$OS" = "FreeBSD" ]; then
  echo
elif [ "$OS" = "void" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Gentoo" ]; then
  HOST_IP=$(hostname -i | awk '{print $1}')
  HOST_IP=192.168.10.10
else
  echo "$OS is not yet implemented."
  exit 1
fi

export HOST_IP
export CURRENT_UID="$(id -u)"
export CURRENT_GID="$(id -g)"

echo HOST_IP=$HOST_IP

mkdir -p ssl
rm -rf build

if [ ! -x "$(command -v yarn)" ]; then
  echo npm install -g yarn
  npm install -g yarn
  echo yarn install
  yarn install
  exit 2
fi

echo yarn build
if [ "$ENV" = "prod" ]; then
  if ! yarn build; then
    echo "yarn build failed"
    exit 1
  fi

  echo docker
  export DOCKER_HOST=ssh://192.168.10.10
  docker stop raspi-finance-react
  docker rm -f raspi-finance-react
  docker rmi raspi-finance-react
  docker rmi -f $(docker images -q -f dangling=true)

  # if ! docker-compose -f docker-compose.yml build; then
  #   echo "docker-compose build failed."
  #   exit 1
  # fi
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
  yarn install
  yarn run prettier
  yarn test
  NODE_OPTIONS=--openssl-legacy-provider yarn start
fi

exit 0
