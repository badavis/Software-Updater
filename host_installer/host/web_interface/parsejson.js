$( document ).ready(function() {
    $.getJSON('../log_scripts/updatelog.json', function(data) {
            var output="<ul>";
            
                output+="<li>" + data.hostname + "</li>";
    
            output+="</ul>";
            document.getElementById("demo").innerHTML=output;
      });    
});
