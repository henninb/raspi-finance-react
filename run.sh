#!/bin/sh

# "$OSTYPE" == "darwin"*
if [ "$OS" = "Linux Mint" ] || [ "$OS" = "Ubuntu" ] || [ "$OS" = "Raspbian GNU/Linux" ]; then
  HOST_IP=$(hostname -I | awk '{print $1}')
elif [ "$OS" = "Arch Linux" ]; then
  HOST_IP=192.168.100.207
elif [ "$OS" = "openSUSE Tumbleweed" ]; then
  HOST_IP=192.168.100.193
elif [ "$OS" = "Solus" ]; then
  HOST_IP=192.168.100.118
elif [ "$OS" = "Fedora" ]; then
  HOST_IP=192.168.100.130
elif [ "$OS" = "Darwin" ]; then
  HOST_IP=$(ipconfig getifaddr en0)
  # echo "lsof -nP | grep LISTEN"
elif [ "$OS" = "void" ]; then
  HOST_IP=127.0.0.1
elif [ "$OS" = "Gentoo" ]; then
  HOST_IP=$(hostname -i | awk '{print $1}')
else
  echo "$OS is not yet implemented."
  exit 1
fi

export HOST_IP



mkdir -p ssl


    if ! docker-compose -f docker-compose.yml build; then
      echo "docker-compose build failed."
      exit 1
    fi

    if ! docker-compose -f docker-compose.yml up; then
      echo "docker-compose up failed."
      exit 1
    fi



echo yarn global add npm-check-updates
ncu -u
yarn install
echo yarn upgrade
echo ncu -u
echo yarn build --profile production
#rm tsconfig.json
yarn start

exit 0
