#!/bin/bash

#Exit automatically if any errors occur
set -e

#---------------------------------------
#   CLIENT INSTALLATION
#---------------------------------------

#Install project dependencies
yum -y install nmap
yum -y install httpd
yum -y install perl
yum -y install openssh-clients
yum -y install openssh-server

#Create SSH directory and set permissions
mkdir ~/.ssh
chmod 700 ~/.ssh

#Get hostname and generate SSH keys to appropriate location
host_id=`hostname`
ssh-keygen -q -f "$host_id" -N ""
mv ./$host_id ~/.ssh
mv ./$host_id.pub ~/.ssh
