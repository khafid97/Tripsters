var places = [];

var results_template = _.template(
          '<div class="panel panel-default">' +
          '<div class="panel-heading">' +
            '<h4 class="panel-title">' +
              '<a data-toggle="collapse" data-parent="#accordion" href=<%="#" + id %> class="srchRes">' +
                '<span class="glyphicon glyphicon-road"></span> <%= name %>' +
              '</a>' +
              //'<a href=<%="#" + id %><a>' +
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

function srchResClicked(){
	var index = $(this).attr("href").split("#")[1];
	plotSearchVenues(places,index, false, false, false);
}


function renderResults(reply, searchType){
	var name;
    var id;
    var phone;
    var city;
    var state;
    var postalCode;
    var address;
	  //var places = reply.response.venues
    //var places = reply.response.groups[0].items


    /*if(searchType == "explore"){
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
      //plotExploreVenues(reply);

    } else if (searchType == "search") {*/
      console.log(reply);
		places = reply;

		places.forEach(function(element, index) {
		console.log(element.name);
		$("#accordion").append(
			results_template({
			address: element.location.address,
			name: element.name,
			id: index,
			phone: element.contact.formattedPhone, 
			city: element.location.city,
			state: element.location.state,
			postalCode: element.location.postalCode
		  })
		);
		});
		var resPanel = $('#results');
		//if (resPanel.height > 600)
		//{
			resPanel[0].style.height = "600px";
			resPanel[0].style.overflowY = "scroll";
		//}
		plotSearchVenues(places, -1, true, false, false);

    //}

  var itString = localStorage["itinerary"];
  if (itString == undefined || itString == '')
  {
	//disable Add button
  }
  else
  {
	var it = JSON.parse(itString);
	$("#it").each(function(){
          $(this).on("click", function(){
            console.log("clicked");
            $(".modal-body").html("");
            var i = 0;
            for (key in it){
              console.log(key);
              $(".modal-body").append('<a href ="#" index="' + i++ + '">' + key + '</a>');
              $(".modal-body").append("<hr>");
            };
			$(".modal-body").append('<form role="search">' +
										'<div class="form-group">' +
											'<input id="newItName" type="text" class="form-control" placeholder="New itinerary name..."/>' +
										'</div>' +
										'<button type="submit" class="btn btn-primary" id="addNewIt">Add to New</button>' +
									'</form>');
            //$(".modal-body").append("<hr>");

          });
      });
  }
  
  $(".panel-title a.srchRes").on("click", srchResClicked);

/**
      var it = {
        itinerary0: [{1: "1"}, {2:"2"}],
        itinerary1: [{1: "1"}, {2:"2"}],
        itinerary2: [{1: "1"}, {2:"2"}],
        itinerary3: [{1: "1"}, {2:"2"}],
      };**/


};


var _categoryList = ['', 'food', 'drinks', 'shops', 'arts', 'sights', 'trending'];
var _categoryNames = ['Category ', 'Food ', 'Nightlife ', 'Shops ', 'Arts ',
'Sights ', 'Trending '];
var _categoryIds = ['0', '4d4b7105d754a06374d81259',
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
    "&v=20130815" +
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
    "&v=20130815" +
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
	if (searchType == "explore")
	{
		var venues = [];
		var items = reply.response.groups[0].items;
		for (var i = 0; i < items.length; i++)
			venues.push(items[i].venue);
	}
	else
		var venues = reply.response.venues;
    renderResults(venues);
});
}

function categoryClicked(e) {
  var index = $(this).attr("index");
  _selectedCategory = _categoryList[index];
  _selCategoryId = _categoryIds[index];
  $('#dropdownBtn').html(_categoryNames[index] + "<b class=\"caret\"></b>");
  console.log(_selectedCategory);
  } 