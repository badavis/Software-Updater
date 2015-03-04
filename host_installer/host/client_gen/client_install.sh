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

#Get Variables
client_ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
client_id=`hostname`

#Generate SSH keys to appropriate location
ssh-keygen -q -f "$client_id" -N ""
mv ./$client_id ~/.ssh
mv ./$client_id.pub ~/.ssh

#Copy program files
mkdir /var/www/html/sccm
chmod 770 /var/www/html/sccm
cp -a ./client/program_files/* /var/www/html/sccm
chmod 770 /var/www/html/sccm*

#---------------------------------------
#   SSH HANDSHAKE
#---------------------------------------

#Advise user SSH key exchange will begin
echo ""
echo "---------------------------------------"
echo "SSH key exchange will now begin. Please"
echo "enter required credentials and confirm"
echo "permanent storage of RSA ID's."
echo "---------------------------------------"
echo ""

#Set up client -> host connection
echo ""
echo "---------------------------------------"
echo "      client -> host handshake         "
echo "---------------------------------------"
echo ""
cat ~/.ssh/$client_id.pub | ssh root@GENERATED_HOST_IP "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

#Set up host -> client connection and add client to list of monitored machines
echo ""
echo "---------------------------------------"
echo "      host -> client handshake         "
echo "---------------------------------------"
echo ""
cat ./client/keys/*.pub >> ~/.ssh/authorized_keys
ssh root@GENERATED_HOST_IP -t -i ~/.ssh/$client_id "echo $client_id $client_ip >> /etc/sccm/clients; ssh root@$client_ip -i ~/.ssh/GENERATED_HOST_ID"