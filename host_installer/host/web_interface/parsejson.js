$( document ).ready(function() {
    $.getJSON('/sccm/farm1_current.log', function(data) {
	
		var output = 	 "<tr> <td>List of Machines </td> <td>Up To Date </td> <td>Online State</td> </tr>"
	
	
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
    
            output+="</tr>";
            document.getElementById("demo").innerHTML=output;
      });    
});
