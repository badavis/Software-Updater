Specification: README

The README should have these sections:

A description of the problem your project addresses.  This can be a 1 paragraph 
description, mentioning the overall topic and why it's important.


		Software packages and tools are becoming increasingly more ubiquitous and 
    more complex. In today’s context of widespread software vulnerabilities, 
    keeping any machine environment to up date is essential for any user or admin. 
    When there is a large number of machines, we often times want to be able to 
    monitor and alter software package versions on these machines easily. Our '
    project provides an intuitive interface that allows users to easily monitor 
    and alter package versions on multiple machines.


A description of how your project addresses that problem.   
This should typically be 2-5 pages, depending on the project.  Provide the 
architecture of your project: what are the components including UNIX services 
and custom software you wrote, how do they interact with each other, using 
what protocols?  Provide a description of the features of your project: what 
does it do and what can it be used for?  If the project involves user input, 
describe how the users would interact with it in order to use the features.  
If the project involved testing and analyzing results, provide those results 
in a clearly understandable format.


		The centerpiece of our project is the web interface. The web interface
	is hosted on the main host machine. It provides a dashboard where the user can
	see all the monitored client machines and their corresponding update status.
	The website frontend is built using the Bootstrap framework. The backend of
	the website consists of various PHP scripts designed to send and pull information
	to and from client machines. These php scripts each remotely executes script 
	on the client machines to do their corresponding tasks. The remote connection 
	in the php scripts is done via the php ssh2 module. 
		From there, we execute scripts stored on the client machines to do a 
	specified task such as update a package. These scripts are mostly written in 
	bash that calls yum with different arguments and appends the output to the 
	client specific log files stored on the host machine. Authentication between
	client and host machine during this step is done via ssh using ssh keys which 
	are generated during installation. The host machine then is able to use the 
	information written in the log files to generate display info such as error 
	messages, system messages, etc on the web interface. We also have two perl
	scripts on the client machines that generates a list of installed packages 
	and a list of outdated packages for that particular in JSON format. The JSON
	files are then piped to the host machine where it is parsed by jQuery and
	displayed on the web interface.
		The web interface provides many software update related features and
	functions. The user can view from the home dashboard the Up-to-date status
	of each individual client machine. Each client machine is listed in a table,
	each having its own row. There are several actions we can perform on each
	machine. We can list all installed packages. Once the packages are listed,
	we can then choose a specific package to either downgrade or remove. We can
	also only list all outdated packages. From there we can simply choose a package
	to update. Moreover, we can choose to update all packages for a particular 
	machine. Finally, if the user wishes, the user also has an option to update
	all machines and make all their software packages up to date. At the bottom
	of the website, we have two columns, one to display the system log, and the
	other to display error logs of a client machine. The logs are automatically
	updated and shown as new actions are performed.


    
