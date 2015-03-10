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

#Set Variables
client_ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
client_id=`hostname`
replacement_string="$client_id\": [\n\t\t\"$client_ip\"\n\t],\n\t\"comment"

#Generate SSH keys to appropriate location
ssh-keygen -q -f "$client_id" -N ""
mv ./$client_id ~/.ssh
mv ./$client_id.pub ~/.ssh

#Copy program files
mkdir /etc/sccm
cp -a ./client/program_files/* /etc/sccm
chmod -R 777 /etc/sccm

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

#Enhancement #4 - Allow hostname resolution client -> host
echo GENERATED_HOST_IP   GENERATED_HOST_ID >> /etc/hosts

#Set up client -> host connection
echo ""
echo "---------------------------------------"
echo "      client -> host handshake         "
echo "---------------------------------------"
echo ""
cat ~/.ssh/$client_id.pub | ssh root@GENERATED_HOST_ID "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

#Enhancement #4 - Allow hostname resolution host -> client
ssh root@GENERATED_HOST_ID -t -i ~/.ssh/$client_id "echo $client_ip   $client_id >> /etc/hosts"

#Set up host -> client connection and add client to list of monitored machines
echo ""
echo "---------------------------------------"
echo "      host -> client handshake         "
echo "---------------------------------------"
echo ""
cat ./client/keys/*.pub >> ~/.ssh/authorized_keys
ssh root@GENERATED_HOST_ID -t -i ~/.ssh/$client_id "ssh root@$client_id -t -i ~/.ssh/GENERATED_HOST_ID "exit""

echo ""
echo "---------------------------------------"
echo "      KEY EXCHANGE COMPLETE            "
echo "---------------------------------------"
echo ""

#Add client to list of monitored clients on host machine
scp -i ~/.ssh/$client_id root@GENERATED_HOST_ID:/var/www/html/sccm/clients.json .
sed -i "s/"comment"/$replacement_string/g" ./clients.json
scp -i ~/.ssh/$client_id ./clients.json root@GENERATED_HOST_ID:/var/www/html/sccm/clients.json

#Add Get Logdata to cron on local machine
crontab -l > mycron || true
echo "* * * * * /etc/sccm/getlogdata.pl" >> mycron
echo "* * * * * /etc/sccm/getpkgdata.pl" >> mycron
crontab mycron
rm mycron

#Summary of changes (Only outputs if no errors)
echo ""
echo ""
echo -e "Installing Dependencies:                                   [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Generating SSH Keys:                                       [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Copying Program Files:                                     [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Establishing Client to Host Handshake:                     [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Establishing Host to Client Handshake:                     [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Adding to monitored machines:                              [  "'\e[00;32m'OK'\e[00m'"  ]"
echo -e "Creating cron job to update monitoring logs:               [  "'\e[00;32m'OK'\e[00m'"  ]"
echo ""
echo ""
