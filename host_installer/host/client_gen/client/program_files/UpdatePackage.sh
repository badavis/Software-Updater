#!/bin/bash
host="GENERATED_HOST_ID"
client_id=`hostname`

echo "------------------------------------" >> OUT
echo "      UPDATING $1                   " >> OUT
echo "------------------------------------" >> OUT

yum update -y $1 1>OUT 2>ERR

echo "------------------------------------" >> OUT
echo "    DONE UPDATING $1                " >> OUT
echo "------------------------------------" >> OUT

cat ERR | ssh root@$host -i ~/.ssh/$client_id "cat >> /var/www/html/sccm/ERRLOG.log"
cat OUT | ssh root@$host -i ~/.ssh/$client_id "cat >> /var/www/html/sccm/SYSLOG.log"
rm -f ERR OUT
