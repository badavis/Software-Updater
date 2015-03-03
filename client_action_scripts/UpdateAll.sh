#!/bin/bash
host="10.0.2.7"
yum update -y 1>OUT 2>ERR
cat ERR | ssh root@10.0.2.7 "cat >> /etc/sccm/ERRLOG.log"
cat OUT | ssh root@10.0.2.7 "cat >> /etc/sccm/SYSLOG.log"
rm -f ERR OUT
