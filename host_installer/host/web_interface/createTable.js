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

$( document ).ready( function(){
    var client = window.location.search.substring(1);   //gets url parameter (the client name)
    document.getElementById("title").innerHTML += " Installed On " + client;
    
    var deferreds = [];
    //var output = "";//"<tr> <td> Machine </td> <td>Packages</td> <td>Up To Date?</td></tr>";
    //document.getElementById("demo").innerHTML = output;
    var output = "<tr> <td> List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td> <td> Result </td> </tr>";
    deferreds.push($.getJSON('/sccm/'+client+'_current.log', function(data){
   	    var rows = [];
        output = "<tr><td id=\"" + client + "\">" + client + "</td>" + "<td>Package Name </td> <td> Old Version </td> <td> New Version </td> </tr>";
        var key, count = 0;
		for(key in data.Packages) {
			if(data.Packages.hasOwnProperty(key)) {
				var old = data.Packages[key][0];
				var curr = data.Packages[key][1];
				output += "<tr><td></td> <td>" + key + "</td><td>" + old + "</td><td>" + curr + 
				"</td> <td class = \"" + client + key + "\"> <a onclick=\"return UpdatePackage(\'" + data.hostname + "\', \'" + key + "\');\"> Update Package </a> </td> </tr>";
				console.log('adding click handler:' + client + key);
			}

		}
    })
    );            
    $.when.apply($, deferreds).then(function(){
         document.getElementById("demo").innerHTML=output;
    });
});