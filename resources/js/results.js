

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

var results_template = _.template(
          '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
              '<a data-toggle="collapse" data-parent="#accordion" href=<%="#" + id %>>' +
                '<span class="glyphicon glyphicon-road"></span> <%= name %>' +
              '</a>' +
              '<a href=<%="#" + id %><a>' +
            '</h4>' +
          '</div>' +
          '<div id="<%= id %>" class="panel-collapse collapse">' +
            '<div class="panel-body" >' +
                '<p> <%= phone %></p>' +
                '<p> <%= address %></p>' +
                '<p> <%= city %>, <%= state %> <%= postalCode %></p>' +
                '<button class="btn btn-primary btn-lg" id="it"  data-toggle="modal" data-target="#myModal">' +
                '  Add to Itinerary' + 
                '</button>' +
            '</div>' +
          '</div>' +
        '</div>'

  );


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




function renderResults(reply, searchType){


	console.log(reply.response.venues);
    var name;
    var id;
    var phone;
    var city;
    var state;
    var postalCode;
    var address;
    var places;


	  //var places = reply.response.venues
    //var places = reply.response.groups[0].items

/**
    if(searchType = "explore"){
      var places = reply.response.groups[0].items
      id = element.venue.id;
      name = element.venue.name;
      phone = element.venue.contact.formattedPhone;
      address = element.venue.location.address;
      city = element.venue.location.city;
      state = element.venue.location.state;
      element.venue.location.postalCode; 

    } else {
      var places = reply.response.venues
      id = element.id;
      name = element.name;
      phone = element.contact.formattedPhone;
      address = element.location.address;
      city = element.location.city;
      state = element.location.state;
      postalCode = element.location.postalCode; 

    } **/


    if(searchType == "explore"){
      var places = reply.response.groups[0].items
  	  places.forEach(function(element) {
        console.log(element.venue.name);
  	  	$("#accordion").append(
            results_template({
            address: element.venue.location.address,
            name: element.venue.name,
            id: element.venue.id,
            phone: element.venue.contact.formattedPhone, 
            city: element.venue.location.city,
            state: element.venue.location.state,
            postalCode: element.venue.location.postalCode
          })
  	  	);
  	  }); 
    } else if (searchType == "search") {
      console.log(reply);
        var places = reply.response.venues
        places.forEach(function(element) {
        console.log(element.venue.name);
        $("#accordion").append(
            results_template({
            address: element.location.address,
            name: element.name,
            id: element.id,
            phone: element.contact.formattedPhone, 
            city: element.location.city,
            state: element.location.state,
            postalCode: element.location.postalCode
          })
        );
      });
    }

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

var _categoryList = ['food', 'drinks', 'shops', 'arts', 'sights', 'trending'];
var _categoryNames = ['Food ', 'Nightlife ', 'Shops ', 'Arts ',
'Sights ', 'Trending '];
var _categoryIds = ['4d4b7105d754a06374d81259',
'4d4b7105d754a06376d81259', '4d4b7105d754a06378d81259',
'4bf58dd8d48988d127951735', '0', '0'];
var _selectedCategory = '';
var _selCategoryId = '0';

$(function () {
  initClickBindings();
  //initialize();
});

function initClickBindings() {
  $('.catMenuItem').click(categoryClicked);
  $('#search').click(search);
}

function search(e) {
  var query = $('#query').val().trim();
  var place = $('#place').val().trim();
  var searchType = 'explore';
  if (query != '' && query != null && query != undefined)
  {
    searchType = 'search';
searchUrl = "https://api.foursquare.com/v2/venues/search" +
"?client_id=WJWD3JLC3ES0NUYDUOUDQS0KYMTHLNFDZVABYIFUCG0SPVQR" +
"&client_secret=XDULXQUQQUBBUSYAK0KUY2NC0DKDE2XMUJ2P3BMKM20AEINY" +
"&near=" + place +
"&query=" + query;
if (_selCategoryId != '0')
 searchUrl += "&categoryId=" + _selCategoryId;
  }
  else
  {
searchUrl = "https://api.foursquare.com/v2/venues/explore" +
"?client_id=WJWD3JLC3ES0NUYDUOUDQS0KYMTHLNFDZVABYIFUCG0SPVQR" +
"&client_secret=XDULXQUQQUBBUSYAK0KUY2NC0DKDE2XMUJ2P3BMKM20AEINY" +
"&near=" + place +
"&query=" + query;
if (_selectedCategory != '')
searchUrl += "&section=" + _selectedCategory;
  }
  $.ajax({
 url: searchUrl
}).done(function(reply) {
 console.log(reply);
 //RAUL: Add your code to render search results here
 renderResults(reply, searchType);
});
}

function categoryClicked(e) {
  var index = $(this).attr("index");
  _selectedCategory = _categoryList[index];
  _selCategoryId = _categoryIds[index];
  $('#dropdownBtn').html(_categoryNames[index] + "<b class=\"caret\"></b>");
  console.log(_selectedCategory);
  }