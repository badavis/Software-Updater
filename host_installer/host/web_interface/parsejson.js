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
   $("#blocker").show();
   var hosty = hostIP;
   //console.log($hosty);
   $.ajax({
      url:'UpdateAll.php',
      type: 'post',
      data: {host: hosty},
      complete: function (response) {
          //$('#output').html(response.responseText);
          $("#blocker").hide();
      },
      error: function () {
          //$('#output').html('Bummer: there was an error!');
	  $("#blocker").hide();
      }

  });
  getSyslog();
  getErrlog();
  console.log("HEllo");
  return false;
}
function UpdateAllMachines(hostList){
	for(hosts in hostList){
		UpdateAll(hosts);
		$("#blocker").hide();	
	}
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
						"</td> <td class = \"" + clientName + key + "\"> <a onclick=\"return UpdatePackage(\'" + data.hostname + "\', \'" + key + "\');\"> <span style=\"cursor:pointer\">Update Package </span> </a> </td> </tr>";
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

function createCH(clients){
   $('#demo').on('click', "#updateallmachines", function(){
		document.getElementById("updateallmachines").innerHTML="Running in background...";
		UpdateAllMachines(clients);
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
	    console.log("Something");
	    console.log(data);
            output +="<tr >";
            
            output+="<td id=\"" + data.hostname + "\">"+ data.hostname + "</td>";

                var key, count = 0;
				for(key in data.Packages) {
					if(data.Packages.hasOwnProperty(key)) {
						count++;
					}

				}
				if(!count){
					output+="<td style=\"color:blue\">" + "YES" + "</td>";
					
				}
				else{
					output+="<td style=\"color:red\">" + "NO" + "</td>";
				}
				output+="<td>" + "BRUH" + "</td>";

				output+="<td>" + "<a href=\"#output\" onclick=\"return UpdateAll(\'" + data.hostname + "\');\"> Update All Packages </a>" + "</td>";
				output+="<td><a href=all_packages.html?" + clientName + "&all>View All Packages</a></td><td><a href=all_packages.html?" + clientName + "&outdated>View Outdated Packages</a></td><td id=\"output\"></td>";

				getSyslog();
				getErrlog();
				
    
            output+="</tr>";
            
      }).fail(function() { 
	    output +="<tr ><td id=\"" + clientName + "\">"+clientName+"</td>";
	    output +="<td style=\"color:blue\"> YES </td> <td color=\"cyan\"> TODO </td>";
	    output +="<td>" + "<a href=\"#output\" onclick=\"return UpdateAll(\'" + clientName + "\');\"> Update All Packages </a>" + "</td>";
       output +="<td><a href=all_packages.html?" + clientName + "&all>View All Packages</a></td><td><a href=all_packages.html?" + clientName + "&outdated>View Outdated Packages</a></td><td id=\"output\">" + "output goes here" + "</td>";

	    document.getElementById("demo").innerHTML+=output;
	    $("#blocker").hide();

      }));
	   $.when.apply($, deferreds).then(function(){

	         console.log("listPackages done");
	         document.getElementById("demo").innerHTML+=output;
            return output;
   });
	
}


$( document ).ready(function() {
   var output = "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td><td>All Packages</td> <td>Out of Date Packages</td> <td>  </td> </tr>";
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
      $("#blocker").hide();
      var output = "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td><td>All Packages</td> <td>Out of Date Packages</td> <td> <a id=\"updateallmachines\"><span style =\"cursor:pointer\">Update All Machines</span></a> </td> </tr>";
      document.getElementById("demo").innerHTML=output;
      $("#blocker").hide();
      for(var key in clients){
         createCH(key);
      }
      console.log(clients["farm1"]);
      console.log("done");
      getSyslog();
      getErrlog();
      for(var key in clients){
         if(key == "comment"){continue;}
         console.log(key);
         var html = [];
         html.push(listPackages(key));
      }
      $("#blocker").hide();
   });
});
