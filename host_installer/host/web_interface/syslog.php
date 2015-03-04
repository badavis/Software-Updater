<? phpinfo(); ?>
<?php

print nl2br(shell_exec('tail -n 20 /var/www/html/sccm/SYSLOG.log'));

?>
