

var button =      '<div class="btn-group" id="drop">' +
                  '  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                  '    Add Itinerary <span class="caret"></span>' +
                  '  </button>' +
                  '  <div class="dropdown-menu" role="menu">' +
                  '    <li><a href="#">Itinerary 1</a></li>' +
                  '    <li><a href="#">Itinerary 2</a></li>' +
                  '    <li><a href="#">Itinerary 3</a></li>' +
                  '  </div>' +
                  '</div>';


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
          '<div id="<%=placeId%>" class="panel-collapse collapse">' +
            '<div class="panel-body">' +
            		'<p> <%= phone %></p>' +
                '<p><%= address %></p>' +
                '<p><%= city %>, <%= state %> <%= zip %></p>' +
                  '<div class="btn-group" id="drop">' +
                  '  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
                  '    Add Itinerary <span class="caret"></span>' +
                  '  </button>' +
                  '  <div class="dropdown-menu" role="menu">' +
                  '    <li><a href="#">Itinerary 1</a></li>' +
                  '    <li><a href="#">Itinerary 2</a></li>' +
                  '    <li><a href="#">Itinerary 3</a></li>' +
                  '  </div>' +
                  '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
	);



$(function () { 
});

function renderResults(reply){

	console.log(reply.response.venues);
	  var places = reply.response.venues

	  places.forEach(function(element) {
      console.log(element.name);
	  	$("#accordion").append(
        '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
              '<a data-toggle="collapse" data-parent="#accordion" href=' + "#" + element.id + '>' +
                '<span class="glyphicon glyphicon-road"></span>' + element.name +
              '</a>' +
              '<a href=' + "#" + element.id + '><a>' +
            '</h4>' +
          '</div>' +
          '<div id="' + element.id +  '" class="panel-collapse collapse">' +
            '<div class="panel-body" >' +
                '<p>' + element.contact.formattedPhone + '</p>' +
                '<p>' + element.location.address + '</p>' +
                '<p>' + element.location.city + ',' +  element.location.state + " " + element.location.postalCode + '</p>' +
                '<button class="btn btn-primary btn-lg" id="it"  data-toggle="modal" data-target="#myModal">' +
                '  Add to Itinerary' + 
                '</button>' +
            '</div>' +
          '</div>' +
        '</div>'




        /**
	  		result_template({
          address: element.location.address,
          placeName: element.name,
	  			placeId: element.id,
	  			phone: element.contact.formattedPhone, 
          city: element.location.city,
          state: element.location.state,
          zip: element.location.postalCode
        
	  		})**/
	  	);

      /**
      $(".it").click(function(){
          //$(".drop").addClass("open");
          console.log("clicked");
          $(".modal-body").append("hello");
      });**/

	  });

      var it = {
        itinerary0: [{1: "1"}, {2:"2"}],
        itinerary1: [{1: "1"}, {2:"2"}],
        itinerary2: [{1: "1"}, {2:"2"}],
        itinerary3: [{1: "1"}, {2:"2"}],
      };

      $("#it").each(function(){
          $(this).on("click", function(){
            console.log("clicked");
            $(".modal-body").html("");
            for (key in it){
              console.log(key);
              $(".modal-body").append('<a href ="#">' + key + '</a>');
              $(".modal-body").append("<hr>");

            };

          });
      });



};