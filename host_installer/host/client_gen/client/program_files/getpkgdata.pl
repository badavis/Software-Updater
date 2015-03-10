#!/usr/bin/perl 

system("/etc/sccm/findAll.sh");
open (INFILE, "<", "/etc/sccm/allPkgs");
open (JSON,   ">", "/etc/sccm/updatelog_all.json");

$hostid = `hostname | tr -d '\n'`;
$grabflag = 0;
$grabstop = "Installed Packages";
$linecount = 0;

#JSON file setup:
$prev_line;
$installed_package;
$date = `date | tr -d '\n'`;

print JSON "{\n \"hostname\": \"$hostid\",\n\"Date\":\"$date\",\n\"Packages\":{";
while($line = <INFILE>){
	if($linecount < 1){
		chomp $line;
	}
	else{
		if($line =~ /([^ \t]+)[ \t]+([^ \t]+)[ \t]+([^ \t]+)/){
			print JSON "\"$1\": \"$2\",";
		}
	}
	$linecount += 1;
}


close INFILE;
close JSON;

#clean up and finalize JSON (get rid of last comma and add braces)

$filename = "/etc/sccm/updatelog_all.json";
my $fsize = -s $filename;
open($FILE, "+<", $filename) or die $!;
seek $FILE, $fsize-1, SEEK_SET;
print $FILE "}\n}\n\n";
close $FILE; 
$hostname_archive = "$hostid"."_archive_all.log";
$hostname_current = "$hostid"."_current_all.log";
$client_id = `hostname | tr -d '\n'`;
$command = "cat $filename | ssh root\@GENERATED_HOST_ID -T -i ~/.ssh/$client_id \"cat >> /var/www/html/sccm/$hostname_archive\"";
system($command);
$command2 = "cat $filename | ssh root\@GENERATED_HOST_ID -T -i ~/.ssh/$client_id \"cat > /var/www/html/sccm/$hostname_current\"";
system($command2); 
exit 0;
	 
