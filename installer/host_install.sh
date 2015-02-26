#!/bin/bash

#---------------------------------------
#   HOST INSTALLATION
#---------------------------------------

#Install IP Mapping software for Diagnostics
yum -y install nmap

#Install Apache web server
yum -y install httpd

#Install web interface to appropriate location
cp -R ./host/web_interface/* /var/www/html

#Start apache and configure to run automatically at boot
service httpd start
chkconfig httpd on

#---------------------------------------
#   Create client files and installer
#---------------------------------------

#Create installer and storage directories
mkdir ./client_installer
mkdir ./client_installer/client
mkdir ./client_installer/client_scripts

#Populate client installer
cp ./host/client_gen/client_install.sh ./client_installer
cp ./host/client_gen/client_scripts/* ./client_installer/client/client_scripts