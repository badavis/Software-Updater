#!/bin/bash

#Install IP Mapping software for Diagnostics
yum -y install nmap

#Install Apache web server
yum -y install httpd

#Install web interface to appropriate location
cp -R ./host_files/web_interface/* /var/www/html

#Start apache and configure to run automatically at boot
service httpd start
chkconfig httpd on
