#!/usr/bin/env bash

# Install repository for up-to-date version of MongoDB, see http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list

# Install packages
apt-get update
apt-get install -y nodejs
apt-get install -y nodejs-legacy
apt-get install -y npm
apt-get install -y mongodb-org

# set working dir to /vagrant on ssh login
grep "cd /vagrant" .bashrc > /dev/null || echo "cd /vagrant" >> .bashrc

npm install -g grunt grunt-cli

cd /vagrant
npm install
grunt
