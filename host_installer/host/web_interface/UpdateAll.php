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
ssh2_exec($ssh, '/etc/sccm/UpdateAll.sh');

?>
