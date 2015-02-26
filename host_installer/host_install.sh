#!/bin/bash

#---------------------------------------
#   HOST INSTALLATION
#---------------------------------------

#Install project dependencies
yum -y install nmap
yum -y install httpd
yum -y install perl
yum -y install openssh-clients
yum -y install openssh-server

#Install web interface to appropriate location
cp -a ./host/web_interface/* /var/www/html

#Start apache and configure to run automatically at boot
service httpd start
chkconfig httpd on

#Create SSH directory and set permissions
mkdir ~/.ssh
chmod 700 ~/.ssh

#Get hostname and generate SSH keys to appropriate location
host_id=`hostname`
ssh-keygen -q -f "$host_id" -N ""
mv ./$host_id ~/.ssh
mv ./$host_id.pub ~/.ssh

#---------------------------------------
#   Create client files and installer
#---------------------------------------

#Copy public key to use in client installer
mkdir ./host/client_gen/client/keys
cp ~/.ssh/$host_id.pub ./host/client_gen/client/keys

#Create and populate client installer directory
mkdir ./client_installer
cp -a ./host/client_gen/* ./client_installer