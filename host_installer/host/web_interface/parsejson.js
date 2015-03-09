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

//A specific machine will need to be specified in the arguments to this method
function UpdateAll(hostIP) {
   var hosty = hostIP;
   //console.log($hosty);
   $.ajax({
      url:'UpdateAll.php',
      type: 'post',
      data: {host: hosty},
      complete: function (response) {
          $('#output').html(response.responseText);
      },
      error: function () {
          $('#output').html('Bummer: there was an error!');
      }

  });
  getSyslog();
  getErrlog();
  console.log("HEllo");
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


function generateDropdown(clientName){
   
   var deferreds = [];
   var output = "";
   var js_obj;
   console.log("in generateDropdown");
   
   deferreds.push( $.getJSON('/sccm/'+clientName+'_current.log', function(data){
      
	         js_obj = data;
   	      var rows = [];
	         output = "<tr><td id=\"" + clientName + "\">" + clientName + "</td>" + "<td>Package Name </td> <td> Old Version </td> <td> New Version </td> </tr>";
            var key, count = 0;
				for(key in data.Packages) {
					if(data.Packages.hasOwnProperty(key)) {
						var old = data.Packages[key][0];
						var curr = data.Packages[key][1];
						output += "<tr><td></td> <td>" + key + "</td><td>" + old + "</td><td>" + curr + 
						"</td> <td class = \"" + clientName + key + "\"> <a onclick=\"return UpdatePackage(\'" + data.hostname + "\', \'" + key + "\');\"> Update Package </a> </td> </tr>";
						console.log('adding click handler:' + clientName + key);
					}

				}
            
            
      }));
	   $.when.apply($, deferreds).then(function(){
	        var table = document.getElementById("demo");
            

	         
	         document.getElementById("demo").innerHTML+=output;
      });
   
}

function revertDropdown(data, output){
	   document.getElementById("demo").innerHTML=output;
	   $('#' + data.hostname).click(function(){
		alert("Click handler called");
		generateDropdown(data, output);
	   });
     
}

function createCH(clientName){
   $('#demo').on('click', '#' + clientName, function(){
		//generateDropdown(clientName);
	});
}

function listPackages(clientName){
   var deferreds = [];
   var output = "";
   var js_obj;
   var done = 0;
   console.log("In listPackages");
   deferreds.push( $.getJSON('/sccm/'+clientName+'_current.log', function(data){
      
	         js_obj = data;
            output +="<tr >";
            
            output+="<td id=\"" + data.hostname + "\"><a href=all_packages.html?" + data.hostname + ">" + data.hostname + "</a></td>";

                var key, count = 0;
				for(key in data.Packages) {
					if(data.Packages.hasOwnProperty(key)) {
						count++;
					}

				}
				if(!count){
					output+="<td>" + "YES" + "</td>";
					
				}
				else{
					output+="<td>" + "NO" + "</td>";
				}
				output+="<td>" + "BRUH" + "</td>";

				output+="<td>" + "<a href=\"#output\" onclick=\"return UpdateAll(\'" + data.hostname + "\');\"> Update All Packages </a>" + "</td>";
				output+="<td id=\"output\">" + "output goes here" + "</td>";

				getSyslog();
				getErrlog();
				
    
            output+="</tr>";
            
      }));
	   $.when.apply($, deferreds).then(function(){
	         console.log("listPackages done");
	         document.getElementById("demo").innerHTML+=output;
            return output;
   });
}


$( document ).ready(function() {
   var output = "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td> <td> Result </td> </tr>";
   document.getElementById("demo").innerHTML=output;
   var deferreds = [];
   var clients = [];
   var count = 0;
   deferreds.push($.getJSON('/sccm/clients.json', function(data) {
         $.each(data.clients, function(i, value){
            clients[i] = value;
         });
      })
   );
   $.when.apply($, deferreds).then(function(){
      for(var key in clients){
         createCH(key);
      }
      console.log(clients["farm1"]);
      console.log("done");
      for(var key in clients){
         if(key == "comment"){continue;}
         console.log(key);
         var html = [];
         html.push(listPackages(key));
      }
   });
});
