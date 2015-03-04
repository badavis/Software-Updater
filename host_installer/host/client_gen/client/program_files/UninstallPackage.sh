#!/bin/bash
host="10.0.2.7"
client_id=`hostname`
yum remove -y $1 1>OUT 2>ERR
cat ERR | ssh root@$host -i ~/.ssh/$client_id “cat >> /etc/sccm/logs/ERRLOG.log”
cat OUT | ssh root@$host -i ~/.ssh/$client_id “cat >> /etc/sccm/logs/OUTPUT.log”
rm -f ERR OUT
