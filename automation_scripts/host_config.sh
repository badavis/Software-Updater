#!/bin/bash

yum -y install nmap
yum -y install httpd

cp -R ~/automation_scripts/host_install/web_interface/* /var/www/html