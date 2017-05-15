$(function(){

	$('#search').keyup(function(){

		var search_term = $(this).val();

		$.ajax({
			method: 'POST',
			url: '/search',
			data: {
				search_term
			},
           dataType: 'json',
           success: function(json){
           	 var data = json.hits.hits.map(function(hit){
  			return hit;
  		    });

             //console.log(data);
             $('#searchResults').empty();
             for(var i=0;i<data.length;i++){
             	var html="";
              html += '<div style="width:90%;margin-left:9%">';
              html += '<a id="driveA" href="project1?id=' + data[i]._source.pId + '">';
              html += '<h4 style="color:yellow"><b>' +  data[i]._source.projectTitle  + '</b></h4>';
              html += '</a>';
              html += '</div>';
             /*	html += ' <div class="col-lg-1 col-md-2 col-sm-4 col-xs-6" align="center" style="margin-top:30px;">';
             	html += '<a id="driveA" href="project?id=' + data[i]._id + '">';
             	html += '<div class="drive">';
             	html += '<img src="/assets/images/folder.png" style="width:80%" />';
             	html += '<p>' +  data[i]._source.projectTitle  + '</p>';
             	html += '</div>'; 
              html += '</a>';

                //html += '<h3>' +  data[i]._source.pType  + '</h3>';
                //html += '<h3>' +  data[i]._source.attachFile  + '</h3>';
                html += '</div>'; */

                $('#searchResults').append(html);
             }

           },

           error: function(error){
           	console.log(err);
           }
		});  
	});




});