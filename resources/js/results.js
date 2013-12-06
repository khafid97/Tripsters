var result_template = _.template(
        '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
              '<a data-toggle="collapse" data-parent="#accordion" href=<%="#" + placeId%> >' +
                '<span class="glyphicon glyphicon-road"></span> <%= placeName%>' +
              '</a>' +
              '<a href=<%="#" + placeId%>><a>'+
            '</h4>' +
          '</div>' +
          '<div id=<%=placeId%> class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            		'<p> <%= phone %></p>' +
                '<p><%= address %></p>' +
                '<p><%= city %>, <%= state %> <%= zip %></p>' +
            '</div>' +
          '</div>' +
        '</div>'
	);





function renderResults(reply){
	console.log(reply.response.venues);
	  var places = reply.response.venues


	  places.forEach(function(element) {
      console.log(element.name);
	  	$("#accordion").append(
	  		result_template({
          address: element.location.address,
          placeName: element.name,
	  			placeId: element.id,
	  			phone: element.contact.formattedPhone, 
          city: element.location.city,
          state: element.location.state,
          zip: element.location.postalCode
	  			//prefix: element.categories[0].icon.prefix,
	  			//suffix: element.categories[0].icon.suffix
	  		})
	  	);
	  });
};