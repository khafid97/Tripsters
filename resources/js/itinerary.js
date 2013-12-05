var _map;
var _markerLayer = [];

function testFourSquareApi(){
	var testUrl = "https://api.foursquare.com/v2/venues/search" +
	"?client_id=WJWD3JLC3ES0NUYDUOUDQS0KYMTHLNFDZVABYIFUCG0SPVQR" +
	"&client_secret=XDULXQUQQUBBUSYAK0KUY2NC0DKDE2XMUJ2P3BMKM20AEINY" +
	"&v=20130815&ll=40.7,-74" +
	"&query=sushi";

	$.ajax({
	  url: testUrl
	}).done(function(reply) {
	  console.log(reply.response.venues);
	  var itinerary = {};
	  $.each(reply.response.venues, function(index, value){
	  	var itineraryIndex = "itinerary" + index%5;
	  	if(!itinerary[itineraryIndex])
	  		itinerary[itineraryIndex] = [];
	  	itinerary[itineraryIndex].push(value);
	  });
	  console.log(itinerary);
	  localStorage["itinerary"] = JSON.stringify(itinerary);
	});
}

function testMapBox(){
	https://api.foursquare.com/v2/venues/explore?ll=40.7,-74
	var testUrl = "https://api.foursquare.com/v2/venues/explore" +
	"?client_id=WJWD3JLC3ES0NUYDUOUDQS0KYMTHLNFDZVABYIFUCG0SPVQR" +
	"&client_secret=XDULXQUQQUBBUSYAK0KUY2NC0DKDE2XMUJ2P3BMKM20AEINY" +
	"&near=New York University" +
	"&categoryId=4d4b7105d754a06378d81259";

	$.ajax({
	  url: testUrl
	}).done(function(reply) {
		// console.log(reply);
	  plotExploreVenues(reply);
	});
}

function plotExploreVenues(data){
	var map = L.mapbox.map('map_canvas', 'rahultewari89.gec4fpdh').setView([51.505, -0.09], 13);
	// var mapboxUrl = 'http://a.tiles.mapbox.com/v3/foursquare.map-b7qq4a62.jsonp';
	// var layer = L.mapbox.tileLayer('rahultewari89.gec4fpdh');
	// examples.map-9ijuk24y


	venues = data['response']['groups'][0]['items'];
      /* Place marker for each venue. */
      for (var i = 0; i < venues.length; i++) {
        /* Get marker's location */
        var latLng = new L.LatLng(
          venues[i]['venue']['location']['lat'],
          venues[i]['venue']['location']['lng']
        );
        /* Build icon for each icon */
        var leafletIcon = L.Icon.extend({
		    options: {
		        iconUrl: 'resources/leaflet/images/marker-icon.png',
		        shadowUrl: null,
		        iconSize: new L.Point(38, 95),
		        shadowSize: new L.Point(68, 95),
		        iconAnchor: new L.Point(22, 94),
		        popupAnchor: new L.Point(-3, -76)
		    }
		});
        // var leafletIcon = L.Icon.extend({
        //   iconUrl: venues[i]['venue']['categories'][0]['icon'],
        //   shadowUrl: null,
        //   iconSize: new L.Point(32,32),
        //   iconAnchor: new L.Point(16, 41),
        //   popupAnchor: new L.Point(0, -51)
        // });
        var icon = new leafletIcon();
        var marker = new L.Marker(latLng, {icon: icon})
          .bindPopup(venues[i]['venue']['name'], { closeButton: false })
          .on('mouseover', function(e) { this.openPopup(); })
          .on('mouseout', function(e) { this.closePopup(); });
        map.addLayer(marker);
        map.panTo(marker.getLatLng())
    }
}

function plotSearchVenues(venues){
	if(!_map)
		_map = L.mapbox.map('map_canvas', 'rahultewari89.gec4fpdh').setView([51.505, -0.09], 13);

	// clear the markers if any
	if(_markerLayer && _markerLayer.length != 0){
		$.each(_markerLayer, function(index, layer){
			_map.removeLayer(layer);
		});
		_markerLayer = [];
	}
	/* Place marker for each venue. */
	var latlngArray = [];
	if(venues && venues.length > 0){
    	for (var i = 0; i < venues.length; i++) {
	        /* Get marker's location */
	        var latLng = new L.LatLng(
	          venues[i]['location']['lat'],
	          venues[i]['location']['lng']
	        );
	        /* Build icon for each icon */
	        var leafletIcon = L.Icon.extend({
			    options: {
			        iconUrl: 'resources/leaflet/images/marker-icon.png',
			        shadowUrl: null,
			        iconSize: new L.Point(38, 95),
			        shadowSize: new L.Point(68, 95),
			        iconAnchor: new L.Point(22, 94),
			        popupAnchor: new L.Point(-3, -76)
			    }
			});
	        var icon = new leafletIcon();
	        var marker = new L.Marker(latLng, {icon: icon})
	          .bindPopup(venues[i]['name'], { closeButton: false })
	          .on('mouseover', function(e) { this.openPopup(); })
	          .on('mouseout', function(e) { this.closePopup(); });
	        _map.addLayer(marker);
	        latlngArray.push(marker.getLatLng());
	        // _map.panTo(marker.getLatLng());
	        _markerLayer.push(marker);
    	}
    	_map.fitBounds(new L.LatLngBounds(latlngArray));
	}
}

// call the plotSearchVenues with the itinerary data
function itClicked(){
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	var chosenIt = $(this).attr("href").split("#")[1];
	plotSearchVenues(itList[chosenIt]);
}

function deleteItClicked(){
	var chosenIt = $(this).attr("href").split("#")[1];
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	// event fires even when we click on alert buttons
	// so need not add again in case alert text is already appended
	if($(this).next(".alert").length == 0){
		var innerHTML = _.template($("#deleteAlert_template").html(), {});
		$(innerHTML).insertAfter(this);
		
		$(".alert").alert();
		$("#deleteId").bind('click', function () {
	  		if(delete itList[chosenIt]){
				localStorage["itinerary"] = JSON.stringify(itList);
				renderIt();
				plotSearchVenues(itList[chosenIt]);
			}
			$(".alert").alert("close");
		});
		$("#backId").bind('click', function () {
			$(".alert").alert("close");
		});

	}
}

function deleteVenueClicked(){
	var chosenIt = $(this).attr("href").split("#")[1];
	var venueIndex = $(this).attr("href").split("#")[2];
	// console.log(chosenIt + " " + chosenVenue);

	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	// event fires even when we click on alert buttons
	// so need not add again in case alert text is already appended
	if($(this).next(".alert").length == 0){
		var innerHTML = _.template($("#deleteAlert_template").html(), {});
		$(innerHTML).insertAfter(this);
		
		$(".alert").alert();
		$("#deleteId").bind('click', function () {
	  		itList[chosenIt].splice(venueIndex, 1);
			localStorage["itinerary"] = JSON.stringify(itList);
			renderIt();
			plotSearchVenues(itList[chosenIt]);
			// expands the required itinerary
			var divId = "#" + chosenIt;
			$(divId).collapse('show');

			$(".alert").alert("close");
		});
		$("#backId").bind('click', function () {
			$(".alert").alert("close");
		});
	}
	// $(this).closest(".panel-collapse").collapse('toggle');
}

// function to render the Itinerary and its contents
function renderIt(){
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	// $.each(itList, function(itName, venueList){
	// 	$.each(venueList, function(index, venue){
	// 		console.log(itName + " " + venue.name);
	// 	});
	// });
	$("#itNavDivId").empty();
	$("#itNavDivId").append(_.template($("#itNavBar_Accordion_template").html(), {"itList" : itList}));

	$(".panel-title a.itLink").on("click", itClicked);
	$(".panel-title .deleteIt").on("click", deleteItClicked);
	$(".panel-body .deleteVenue").on("click", deleteVenueClicked);
}