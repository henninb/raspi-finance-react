#!/bin/sh

ENV=$1
APP=raspi-finance-react

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

./os-env

# "$OSTYPE" == "darwin"*
if [ "$OS" = "Linux Mint" ] || [ "$OS" = "Ubuntu" ] || [ "$OS" = "Raspbian GNU/Linux" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Arch Linux" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "openSUSE Tumbleweed" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Solus" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Fedora" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Darwin" ]; then
  HOST_IP=$(ipconfig getifaddr en0)
elif [ "$OS" = "void" ]; then
  HOST_IP=$(ip route get 1.2.3.4 | awk '{print $7}')
elif [ "$OS" = "Gentoo" ]; then
  HOST_IP=$(hostname -i | awk '{print $1}')
else
  echo "$OS is not yet implemented."
  exit 1
fi

export HOST_IP
export CURRENT_UID="$(id -u)"
export CURRENT_GID="$(id -g)"

mkdir -p ssl

if [ "$ENV" = "prod" ]; then
  yarn build:prod
  if ! docker-compose -f docker-compose.yml build; then
    echo "docker-compose build failed."
    exit 1
  fi

  if ! docker-compose -f docker-compose.yml up; then
    echo "docker-compose up failed."
    exit 1
  fi
  # echo docker build -t my-react-app -f Dockerfile-nginx .
  # docker build -t my-react-app -f Dockerfile-nginx .
  # docker run -it -p 80:80 --rm my-react-app
else
  echo yarn global add npm-check-updates
  ncu -u
  yarn install
  echo yarn upgrade
  yarn start
fi

exit 0
