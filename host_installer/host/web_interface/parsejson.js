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


function generateDropdown(data2, output2){
	console.log("HERE I AM");
	var rows = [];
	var output = "<tr id=\"" + data2.hostname + "\"> <td>" + data2.hostname + "</td>" + "<td>Package Name </td> <td> Old Version </td> <td> New Version </td> </tr>";
        var key, count = 0;
				for(key in data2.Packages) {
					if(data2.Packages.hasOwnProperty(key)) {
						var old = data2.Packages[key][0];
						var curr = data2.Packages[key][1];
						output += "<tr><td></td> <td>" + key + "</td><td>" + old + "</td><td>" + curr + 
						"</td> <td id = \"" + key + "\"> Update Package </td> </tr>";
						
						
					}

				}
				//output+="<td>" + "<a href=\"#output\" onclick=\"return UpdateAll("10.0.2.6");\"> Update All Packages </a>" + "</td>";
				//output+="<td id=\"output\">" + "output goes here" + "</td>"
				//getSyslog();
				//getErrlog();
				
    
            //output+="</tr>";
	document.getElementById(data2.hostname).outerHTML = output;
	for(key2 in data2.Pacakges){
		$('#' + key2).click(function(){
			alert("Click handler called");
			UpdatePackage("10.0.2.6", key2);
	   }); 
	}
	$('#' + data2.hostname).click(function(){
		alert("Click handler called");
		revertDropdown(data2, output2);
	    }); 
	    //for(item in document.getElementById("demo").children){
		//if(item.id == data2.hostname){
		//	document.getElementById("demo").children[count] =     
}

function revertDropdown(data, output){
	    document.getElementById("demo").innerHTML=output;
	    $('#' + data.hostname).click(function(){
		alert("Click handler called");
		generateDropdown(data, output);
	    });
     
}

$( document ).ready(function() {
    $.getJSON('/sccm/farm1_current.log', function(data) {
	
		var output = 	 "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td> <td> Result </td> </tr>"
	
	
            output +="<tr id=\"" + data.hostname + "\">";
            
            output+="<td>" + data.hostname + "</td>";

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
				output+="<td>" + "<a href=\"#output\" onclick=\"return UpdateAll();\"> Update All Packages </a>" + "</td>";
				output+="<td id=\"output\">" + "output goes here" + "</td>"
				getSyslog();
				getErrlog();
				
    
            output+="</tr>";
	    
            document.getElementById("demo").innerHTML=output;
	    $('#' + data.hostname).click(function(){
		alert("Click handler called");
		generateDropdown(data, output);
	    });
      });    
});
