#!/bin/bash
#Checks all installed packages, checks all possible updates, list them
for packages in `yum list updates -q | awk ' NR>1 {print $1}'`; do
	yum list ${packages} -q >> availUpdates
done
