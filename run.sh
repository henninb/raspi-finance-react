#!/bin/sh

echo yarn global add npm-check-updates
ncu -u
yarn install
echo yarn upgrade
echo ncu -u
yarn start

exit 0
