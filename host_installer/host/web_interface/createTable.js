function getSyslog() {
   $.ajax({
      url:'syslog.php',
      complete: function (response) {
          $('#SYSLOG').html(response.responseText);
      },
      error: function () {
          $('#SYSLOG').html('Bummer: there was an error!');
      }
  });
  return false;
}

function getErrlog() {
   $.ajax({
      url:'errlog.php',
      complete: function (response) {
          $('#ERRLOG').html(response.responseText);
      },
      error: function () {
          $('#ERRLOG').html('Bummer: there was an error!');
      }
  });
  return false;
}

function uninstallPackage(hostIP, pkgName){
   $.ajax({
      url:'UninstallPackage.php',
      type: 'post',
      data: {host: hostIP, name: pkgName},
      complete: function (response) {
          $('#output').html(response.responseText);
      },
      error: function () {
          $('#output').html('Bummer: there was an error!');
      }

  });
  getSyslog();
  getErrlog();
  return false;
}

function rollbackPackage(hostIP, pkgName){
   $.ajax({
      url:'RollbackPackage.php',
      type: 'post',
      data: {host: hostIP, name: pkgName},
      complete: function (response) {
          $('#output').html(response.responseText);
      },
      error: function () {
          $('#output').html('Bummer: there was an error!');
      }

  });
  getSyslog();
  getErrlog();
  return false;
}

function UpdatePackage(hostIP, pkgName){
	console.log("UpdatePackage on " +hostIP+ " package name = " + pkgName);
	$.ajax({
      url:'UpdatePackage.php',
      type: 'post',
      data: {host: hostIP, name: pkgName},
      complete: function (response) {
          $('#output').html(response.responseText);
      },
      error: function () {
          $('#output').html('Bummer: there was an error!');
      }

  });
  getSyslog();
  getErrlog();
  return false;

}

$( document ).ready( function(){
    var query = window.location.search.substring(1);   //gets url parameter (the client name)
    var items = query.split("&");
    var client = items[0];
    var pageType = items[1];
    var json_file;
    
    if(pageType == "all"){
        document.getElementById("title").innerHTML = "All Packages Installed On " + client;
        json_file = "_current_all.log";
    }
    if(pageType == "outdated"){
        document.getElementById("title").innerHTML = "Outdated Packages Installed On " + client;
        json_file = "_current.log";
    }
    var deferreds = [];
    var output = "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td> <td> Result </td> </tr>";
    deferreds.push($.getJSON('/sccm/'+client+json_file, function(data){
   	    var rows = [];
        
        var key, count = 0;
        if(pageType == "outdated"){
            output = "<tr><td id=\"" + client + "\">" + client + "</td>" + "<td>Package Name </td> <td> Old Version </td> <td> New Version </td> </tr>";
    		for(key in data.Packages) {
    			if(data.Packages.hasOwnProperty(key)) {
    				var old = data.Packages[key][0];
    				var curr = data.Packages[key][1];
    				output += "<tr><td></td> <td>" + key + "</td><td>" + old + "</td><td>" + curr + 
    				"</td> <td class = \"" + client + key + "\"> <a onclick=\"return UpdatePackage(\'" + data.hostname + "\', \'" + key + "\');\"> Update Package </a> </td> </tr>";
    				console.log('adding click handler:' + client + key);
    			}
    
    		}
        }
        if(pageType == "all"){
            output = "<tr><td id=\"" + client + "\">" + client + "</td>" + "<td>Package Name </td> <td> Version </td> <td>Downgrade</td> <td>Uninstall</td> </tr>";
            for(key in data.Packages) {
    			if(data.Packages.hasOwnProperty(key)) {
    				var curr = data.Packages[key];
    				output += "<tr><td></td> <td>" + key + "</td><td>" + curr + 
    				"</td> <td class = \"" + client + key + "\"> <a onclick=\"return rollbackPackage(\'" + data.hostname + "\', \'" + key + "\');\"> Downgrade </a> </td><td class = \"" + client + key + "\"> <a onclick=\"return UninstallPackage(\'" + data.hostname + "\', \'" + key + "\');\"> Uninstall </a> </td></tr>";
    				console.log('adding click handler:' + client + key);
    			}
    
    		}
        }
    })
    );            
    $.when.apply($, deferreds).then(function(){
         document.getElementById("demo").innerHTML=output;
		 getSyslog();
         getErrlog();
    });
});