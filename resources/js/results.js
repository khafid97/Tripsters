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
            // if(phone && phone != "")
                '<p> <%= phone %></p>' +
              // if(address && address != "")
                '<p> <%= address %></p>' +
              // if(city && city != "" || state && state != "" || postalCode && postalCode != "")
                '<p> <%= city %>, <%= state %> <%= postalCode %></p>' +
                '<button class="btn btn-primary btn-lg addToIt" id="it"  data-toggle="modal" data-target="#myModal">' +
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

// when a IT is clicked in the modal
function itModalClicked(){
  // get the IT name
  var itName = $(this).text();
  // get the venue details
  var placeIndex = $(".panel-collapse.in").attr("id")
  var venue = places[placeIndex];

  // get the current IT list
  var itString = localStorage["itinerary"];
  var itList = JSON.parse(itString);
  // add to the required IT, will add duplicates right now
  itList[itName.replace(/ /g, "%")].push(venue);
  // save back to local storage
  localStorage["itinerary"] = JSON.stringify(itList);

  // show success message
  $(".modal-footer .alert").text("Added successfully to " + itName);
  $(".modal-footer .alert").show();
}

// add venue to new IT
function addToNewItClicked(){
  // get the new IT name
  var newItName = $("#newItName").val();
  if(newItName == "" || newItName == null || newItName == undefined){
    $("#newItName").closest(".form-group").addClass("has-error");
    $("#newItName").next("label")[0].style.display = "block";
    return;
  }

  // get the current IT list
  var itString = localStorage["itinerary"];
  var itList = JSON.parse(itString);
  // get the venue details
  var placeIndex = $(".panel-collapse.in").attr("id")
  var venue = places[placeIndex];

  // replace the spaces
  var newItMod = newItName.replace(/ /g, "%");
  itList[newItMod] = [];
  itList[newItMod].push(venue);
  // save back to local storage
  localStorage["itinerary"] = JSON.stringify(itList);

  // need to render the modal again with the new itinerary
  // and show the label
  populateModal(JSON.stringify(itList));
  $(".modal-footer .alert").text("Created " + newItName + " and added the venue successfully");
  $(".modal-footer .alert").show();
}

// populate the modal
function populateModal(itString){
  var it = {};
  if(itString != undefined && itString != ""){
    it = JSON.parse(itString);
  }
  // empty the modal body

  $(".modal-body").empty();
  for (key in it){
    console.log(key);
    $(".modal-body").append('<a class="itModal" href="#">' + key.replace(/%/g, " ") + '</a>');
    $(".modal-body").append("<hr>");
  };

  $(".modal-body").append('<form role="search">' +
        '<div class="form-group">' +
          '<input id="newItName" type="text" class="form-control" placeholder="New itinerary name..."/>' +
          '<label class="control-label" for="newItName" style="display:none">Enter a name</label>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary" id="addNewIt">Add to New</button>' +
      '</form>');
  //$(".modal-body").append("<hr>");

  $(".itModal").on("click", itModalClicked);
  $("#addNewIt").on("click", addToNewItClicked);
  // remove error message
  $("#newItName").bind("keyup", function(){
    var text = $(this).val().trim();
    if(text != null && text != undefined && text != ""){
      $(this).closest(".form-group").removeClass("has-error");
      $(this).next("label")[0].style.display = "none";
    }
  });

  
}

function renderResults(reply, searchType){

  // empty the left nav
  $("#accordion").empty();
  $('#nores')[0].style.display = 'none';
  if(reply && reply.length > 0){

  	 var name;
      var id;
      var phone;
      var city;
      var state;
      var postalCode;
      var address;

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


      //Opens first result
      $('a[href="#0"]').removeClass("collapsed");
      $('#0').addClass("in");    
      var index = "0";//"#0".split("#")[1];
      plotSearchVenues(places,index, false, false, false);

      //}

    var itString = localStorage["itinerary"];
    if (itString == undefined || itString == '')
    {
  	//disable Add button
    }
    else
    {
  	 populateModal(itString);
    }
    
    // clicks the search results on the left
    $(".panel-title a.srchRes").on("click", srchResClicked);
  } else {

    $('#nores')[0].style.display = 'block';

}
  $(".addToIt").each(function(){
     $(this).on("click", function(){
      populateModal(itString);

    });
  });

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
  // check for empty places
  if(place == "" || place == null || place == undefined){
    $("#place").closest(".form-group").addClass("has-error");
    $("#place").next("label")[0].style.display = "block";
    // remove error message
    $("#place").bind("keyup", function(){
      var text = $(this).val().trim();
      if(text != null && text != undefined && text != ""){
        $(this).closest(".form-group").removeClass("has-error");
        $(this).next("label")[0].style.display = "none";
      }
    });
    return;
  }

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