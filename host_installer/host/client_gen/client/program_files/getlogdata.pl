#!/usr/bin/perl 

system("/etc/sccm/findOld.sh");
open (INFILE, "<", "/etc/sccm/availUpdates");
open (JSON,   ">", "/etc/sccm/updatelog.json");

$hostid = `hostname | tr -d '\n'`;
$grabflag = 0;
$grabstop = "Installed Packages";
$linecount = 0;

#JSON file setup:
$prev_line;
$installed_package;
$date = `date | tr -d '\n'`;

while($line = <INFILE>){
	chomp $line;
	if($linecount == 0){
		$hostname = $line;
		print JSON "{\n \"hostname\": \"$hostid\",\n\"Date\":\"$date\",\n\"Packages\":{";
		$linecount++;
	}

	if($grabflag == 1){
		if($installed_package =~ /([^ \t]+)[ \t]+([^ \t]+)/){
			print JSON "\"$1\": [\"$2\","; 
		}
		if($line =~ /([^ \t]+)[ \t]+([^ \t]+)/){
			print JSON " \"$2\"],\n";
		}
		$grabflag = 0;
	}

	if($line =~ /Available Packages/){
		$grabflag = 1;
		$installed_package = $prev_line;		
	}
	$prev_line = $line;
}


close INFILE;
close JSON;

#clean up and finalize JSON (get rid of last comma and add braces)

$filename = "/etc/sccm/updatelog.json";
my $fsize = -s $filename;
open($FILE, "+<", $filename) or die $!;
seek $FILE, $fsize-2, SEEK_SET;
print $FILE "}\n}\n\n";
close $FILE; 
$hostname_archive = "$hostid"."_archive.log";
$hostname_current = "$hostid"."_current.log";
$client_id = `hostname | tr -d '\n'`;
$command = "cat $filename | ssh root\@GENERATED_HOST_ID -T -i ~/.ssh/$client_id \"cat >> /var/www/html/sccm/$hostname_archive\"";
system($command);
$command2 = "cat $filename | ssh root\@GENERATED_HOST_ID -T -i ~/.ssh/$client_id \"cat > /var/www/html/sccm/$hostname_current\"";
system($command2); 
exit 0;
	 
