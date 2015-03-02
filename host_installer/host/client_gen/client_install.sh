#!/bin/bash

#Exit automatically if any errors occur
set -e

#---------------------------------------
#   CLIENT INSTALLATION
#---------------------------------------

#Install project dependencies
yum -y install nmap
yum -y install perl
yum -y install openssh-clients
yum -y install openssh-server

#Create SSH directory and set permissions
mkdir ~/.ssh
chmod 700 ~/.ssh

#Get IP Address of client
client_ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`

#Get hostname and generate SSH keys to appropriate location
client_id=`hostname`
ssh-keygen -q -f "$client_id" -N ""
mv ./$client_id ~/.ssh
mv ./$client_id.pub ~/.ssh

#Set up client -> host connection
echo ""
nmap -sP 10.0.2.0-25
echo ""
echo "Please enter the IP of the host machine. (Use above output for assistance)."
read host_ip
echo "Please enter the hostname of the host machine."
read host_id
cat ~/.ssh/$client_id.pub | ssh root@$host_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

#Set up host -> client connection
cat ./client/keys/*.pub >> ~/.ssh/authorized_keys
ssh root@$host_ip -t -i ~/.ssh/$client_id "ssh root@$client_ip -i ~/.ssh/$host_id"