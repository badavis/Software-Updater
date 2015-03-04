# 183Project
CS183 Unix System Administration Project: Software Updater

Assumptions for install:

OS: CentOS 6.6
Working DNS server that allows hostname resolution on the local network
You will secure the program installation (Permissions 755 by default)
Program is installed for the same user on all machines (with sudo)
All machines are on the same local network

To deploy project:

1. Download the "host_installer" folder and place in the HOME DIRECTORY of your server
2. CD into "host_installer" and run "host_install.sh"
3. The server installation is complete. You should now be able to view
   the web dashboard by navigating to the address below on your server:
    http://localhost/template.html
4. Once installation completes a new folder should appear in "host_installer" called "client_installer"

   Take this folder and place it in the HOME DIRECTORY of any client machine you wish to add

5. CD into "client_installer" and run "client_install.sh" completing any required prompts
6. Refresh the web dashboard and you should see your new client machinein the monitored list.