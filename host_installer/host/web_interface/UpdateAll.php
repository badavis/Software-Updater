<? phpinfo(); ?>
<?php

passthru('ssh root@10.0.2.6 '/etc/sccm/scripts/UpdateAll.sh'');

?>