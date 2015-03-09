#!/bin/bash
#Checks all installed packages, checks all possible updates, list them
rm -f /etc/sccm/availUpdates
for packages in `yum list updates -q | awk ' NR>1 {print $1}'`; do
	yum list ${packages} -q >> /etc/sccm/availUpdates
done
