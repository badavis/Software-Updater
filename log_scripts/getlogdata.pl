#!/usr/bin/perl 

`./findOld.sh`;

open (INFILE, "<", "availUpdates");
open (JSON,   ">", "updatelog.json");

$grabflag = 0;
$grabstop = "Installed Packages";
$linecount = 0;

#JSON file setup:
$prev_line;
$installed_package;
$date = `date`;
$hostname;

while($line = <INFILE>){
	chomp $line;
	if($linecount == 0){
		$hostname = $line;
		print JSON "{\n \"hostname\": \"$line\",\n\"Date\":\"$date\",\n\"Packages\":{";
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

$filename = "updatelog.json";
my $fsize = -s $filename;
open($FILE, "+<", $filename) or die $!;
seek $FILE, $fsize-2, SEEK_SET;
print $FILE "}\n}\n\n";
close $FILE; 

$hostname_archive = "$hostname"."_archive.log";
$hostname_current = "$hostname"."_current.log";

`cat $filename | ssh root\@10.0.2.7 "cat >> /root/logs/$hostname_archive"`;
`cat $filename | ssh root\@10.0.2.7 "cat > /root/logs/$hostname_current"`;

exit 0;
	 
