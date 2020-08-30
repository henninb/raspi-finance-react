#!/bin/sh

ncu -u
yarn install
echo yarn upgrade
echo ncu -u
yarn start

exit 0
