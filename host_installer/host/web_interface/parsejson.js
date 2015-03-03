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
function UpdateAll() {
   $.ajax({
      url:'UpdateAll.php',
      complete: function (response) {
          $('#output').html('worked');
      },
      error: function () {
          $('#output').html('Bummer: there was an error!');
      }

  });
  return false;
}

$( document ).ready(function() {
    $.getJSON('/sccm/farm1_current.log', function(data) {
	
		var output = 	 "<tr> <td>List of Machines </td> <td>Up To Date </td> <td>Online State</td> <td> Update </td> <td> Result </td> </tr>"
	
	
            output +="<tr>";
            
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
      });    
});
