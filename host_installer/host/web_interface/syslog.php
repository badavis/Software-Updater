<? phpinfo(); ?>
<?php

print nl2br(shell_exec('tail -n 50 /var/www/html/sccm/SYSLOG.log'));

?>
