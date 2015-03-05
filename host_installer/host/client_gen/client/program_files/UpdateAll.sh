#!/bin/bash
host="GENERATED_HOST_ID"
client_id=`hostname`

echo "------------------------------------" >> OUT
echo "      UPDATING ALL PACKAGES         " >> OUT
echo "------------------------------------" >> OUT

yum update -y 1>OUT 2>ERR

echo "------------------------------------" >> OUT
echo "    DONE UPDATING ALL PACKAGES      " >> OUT
echo "------------------------------------" >> OUT

cat ERR | ssh root@$host -i ~/.ssh/$client_id "cat >> /var/www/html/sccm/ERRLOG.log"
cat OUT | ssh root@$host -i ~/.ssh/$client_id "cat >> /var/www/html/sccm/SYSLOG.log"
rm -f ERR OUT
