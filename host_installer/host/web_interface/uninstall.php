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
echo "uninstall.php: Running UninstallPackage.sh\n";
ssh2_exec($ssh, "/etc/sccm/UninstallPackage.sh $name");
echo "uninstall.php: Running getlogdata.pl\n";
ssh2_exec($ssh, "/etc/sccm/getlogdata.pl");
echo "uninstall.php: Running getpkgdata.pl\n";
ssh2_exec($ssh, "/etc/sccm/getpkgdata.pl");
echo "uninstall.php: Running exit\n";
ssh2_exec($ssh, "exit");


?>