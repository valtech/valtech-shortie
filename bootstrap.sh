#!/usr/bin/env bash

apt-get update
apt-get install -y nodejs
apt-get install -y nodejs-legacy
apt-get install -y npm
apt-get install -y mongodb

npm install -g grunt grunt-cli

cd /vagrant
npm install
grunt
