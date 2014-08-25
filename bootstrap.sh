#!/usr/bin/env bash

# Install packages
apt-get update
apt-get install -y nodejs
apt-get install -y nodejs-legacy
apt-get install -y npm
apt-get install -y mongodb

# set working dir to /vagrant on ssh login
grep "cd /vagrant" .bashrc > /dev/null || echo "cd /vagrant" >> .bashrc

npm install -g grunt grunt-cli

cd /vagrant
npm install
grunt
