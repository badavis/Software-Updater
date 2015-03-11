<? phpinfo(); ?>
<?php

$hosty = $_POST['host'];
$name = $_POST['name'];
$ssh = ssh2_connect($hosty, 22);
if(ssh2_auth_password($ssh, 'root', 'awesomegroup')){
	echo "Authentication Successful\n";
}
else{
	die('Authentication failed');
}
ssh2_exec($ssh, "/etc/sccm/rollbackPackage.sh $name");
ssh2_exec($ssh, "/etc/sccm/getlogdata.pl");
ssh2_exec($ssh, "/etc/sccm/getpkgdata.pl");
ssh2_exec($ssh, "exit");


?>