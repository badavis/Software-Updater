#!/bin/bash

#Exit automatically if any errors occur
set -e

#---------------------------------------
#   HOST INSTALLATION
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

#Get Variables
host_id=`hostname`
host_ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`

#Generate SSH keys to appropriate location
ssh-keygen -q -f "$host_id" -N ""
mv ./$host_id ~/.ssh
mv ./$host_id.pub ~/.ssh

#Install web interface to appropriate location
cp -a ./host/web_interface/* /var/www/html

#Start apache and configure to run automatically at boot
service httpd start
chkconfig httpd on

#Copy program files

#---------------------------------------
#   CREATE CLIENT FILES AND INSTALLER
#---------------------------------------

#Add host machine IP and hostname to required areas in client scripts
sed -i "s/GENERATED_HOST_IP/$host_ip/g" ./host/client_gen/client_install.sh
sed -i "s/GENERATED_HOST_ID/$host_id/g" ./host/client_gen/client_install.sh

#Copy public key to use in client installer
mkdir ./host/client_gen/client/keys
cp ~/.ssh/$host_id.pub ./host/client_gen/client/keys

#Create and populate client installer directory
mkdir ./client_installer
cp -a ./host/client_gen/* ./client_installer