#!/bin/bash
host="10.0.2.7"
yum update -y $1 1>OUT 2>ERR
cat ERR | ssh root@$host “cat >> /etc/sccm/ERRLOG.log”
cat OUT | ssh root@$host “cat >> /etc/sccm/OUTPUT.log”
rm -f ERR OUT
