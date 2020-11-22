#!/bin/sh

mkdir -p ssl
echo yarn global add npm-check-updates
#ncu -u
yarn install
echo yarn upgrade
echo ncu -u
echo yarn build --profile production
rm tsconfig.json
yarn start

exit 0
