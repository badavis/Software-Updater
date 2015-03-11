<? phpinfo(); ?>
<?php

$hosty = $_POST['host'];
$ssh = ssh2_connect($hosty, 22);
if(ssh2_auth_password($ssh, 'root', 'awesomegroup')){
	echo "Authentication Successful\n";
}
else{
	die('Authentication failed');
}
echo "UpdateAll.php Running UpdateAll.sh\n";
ssh2_exec($ssh, "/etc/sccm/UpdateAll.sh");
echo "UpdateAll.php: Running getlogdata.pl\n";
ssh2_exec($ssh, "/etc/sccm/getlogdata.pl");
echo "UpdateAll.php: Running getpkgdata.pl\n";
ssh2_exec($ssh, "/etc/sccm/getpkgdata.pl");
echo "UpdateAll.php: Running exit\n";
ssh2_exec($ssh, "exit");


?>
