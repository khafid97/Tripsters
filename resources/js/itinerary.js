var _map;
var _markerLayer = [];
var _polyLayer = [];

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

function plotSearchVenues(venues,index, resetBound, animate, drawLines){
	if (drawLines == undefined)
		drawLines = true;
	if(!_map)
		_map = L.mapbox.map('map_canvas', 'rahultewari89.gec4fpdh').setView([51.505, -0.09], 13);

	// clear the markers if any
	if(_markerLayer && _markerLayer.length != 0){
		$.each(_markerLayer, function(index, layer){
			_map.removeLayer(layer);
		});
		_markerLayer = [];
	}
	// clear the polylines if any
	if(_polyLayer && _polyLayer.length != 0){
		$.each(_polyLayer, function(index, layer){
			_map.removeLayer(layer);
		});
		_polyLayer = [];
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

	        if(index == i){
	        	var icon = L.AwesomeMarkers.icon({icon: 'star',  
	        		prefix: 'glyphicon',
	        		markerColor: 'red'});
	        }
	        else{
	        var icon = L.AwesomeMarkers.icon({icon: 'star',  
	        		prefix: 'glyphicon',
	        		markerColor: 'green'});
	    	}

	    	var markerHTML = "<b>" + venues[i]['name'] + "</b><br/>";
	    	if(venues[i]['location']['address'] != "" && venues[i]['location']['address'] != " " && venues[i]['location']['address'] != null)
	    		markerHTML += venues[i]['location']['address'] + "<br/>";
	    	if(venues[i]['location']['city'] != "" && venues[i]['location']['city'] != " " && venues[i]['location']['city'] != null)
	    		markerHTML += venues[i]['location']['city'] + "<br/>";
	    	if(venues[i]['location']['postalCode'] != "" && venues[i]['location']['postalCode'] != " " && venues[i]['location']['postalCode'] != null)
	    		markerHTML += venues[i]['location']['postalCode'] + "<br/>";

	        var marker = new L.Marker(latLng, {icon: icon})
	          .bindPopup(markerHTML, { closeButton: false })
	          .on('mouseover', function(e) { this.openPopup(); })
	          .on('mouseout', function(e) { this.closePopup(); });

	        _map.addLayer(marker);
	        latlngArray.push(marker.getLatLng());
	        // _map.panTo(marker.getLatLng());
	        _markerLayer.push(marker);
	        

	        // if animate, open popup now
	        if(index == i){// && animate){
	        	marker.openPopup();
	        }

	        // polyline ....
	        if(i > 0 && drawLines){
		    	var latlngs = Array();
				//Get latlng from first marker
				latlngs.push(_markerLayer[i-1].getLatLng());
				//Get latlng from first marker
				latlngs.push(_markerLayer[i].getLatLng());
				//From documentation http://leafletjs.com/reference.html#polyline
				// create a blue polyline from an arrays of LatLng points
				// red in case of animate
				var polyline;
				if(index == i && animate)
					polyline = L.polyline(latlngs, {color: 'red'}).addTo(_map);
				else
					polyline = L.polyline(latlngs, {color: 'blue'}).addTo(_map);
				
				_polyLayer.push(polyline);
			}
    	}
    	if(resetBound && resetBound == true)
    		_map.fitBounds(new L.LatLngBounds(latlngArray));
	}
}

// recursice function that animates
function animate(it, index, length){
	setTimeout(function () {
        	plotSearchVenues(it, index, false, true);
        	index++;
        	if(index < length)
        		animate(it, index, length);
        	else{
        		setTimeout(function () {
        			plotSearchVenues(it,"false", false);
        		}, 2000);
        	}
	}, 1000);
}

// IT visualization
function runITAnimation(){
	var chosenIt = $(this).attr("itId").split("#")[1];

	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	animate(itList[chosenIt], 0, itList[chosenIt].length);
}

// call the plotSearchVenues with the itinerary data
function itClicked(){
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);
	//$(this).css({ "background-color": 'brown'});
	
	$('.highlight').removeClass('highlight');
    $(this).closest(".panel-heading").addClass('highlight');
	var chosenIt = $(this).attr("itId").split("#")[1];
	plotSearchVenues(itList[chosenIt],"false", true);
}


function venueClicked(){
	var chosenIt = $(this).attr("itId").split("#")[1];
	var venueIndex = $(this).attr("itId").split("#")[2];
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);
	console.log("venue " + venueIndex);
	plotSearchVenues(itList[chosenIt],venueIndex);
}

function deleteItClicked(){
	var chosenIt = $(this).attr("itId").split("#")[1];
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);
	console.log("delete");
	console.log(chosenIt);

	//chosenIt = chosenIt.replace(" ", "_");
	// event fires even when we click on alert buttons
	// so need not add again in case alert text is already appended
	if($(this).next(".alert").length == 0){
		var innerHTML = _.template($("#deleteAlert_template").html(), {});
		$(innerHTML).insertAfter(this);
		
		$(".alert").alert();
		$("#deleteId").bind('click', function () {
			console.log("really delete");
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

// function called when the modal Save is clicked
function modalSaveClick(e){
	var itString = localStorage["itinerary"];
	var itList = JSON.parse(itString);

	var newIt = $("#newItNameId").val();
	newIt = newIt.replace(/ /g, "%");
	// show error in case mepty itinerary
	if(newIt == "" || newIt == undefined || newIt == null){
		$("#newItNameId").closest(".form-group").addClass("has-error");
		$("#newItNameId").next("label")[0].style.display = "block";
		return;
	}

	itList[newIt] = {};
	localStorage["itinerary"] = JSON.stringify(itList);

	// render the new left nav
	renderIt();
	$("#addItModalId").modal("hide");
	// expand the created IT
	$("#" + newIt.split(" ")[0]).collapse('show');
	// should clear the map
	plotSearchVenues();
	$("#newItNameId").val("")
}

// add an empty itinerary
function addItClicked(){
	$("#addItModalId").modal("show");
	// bind the save click
	$("#addItId").on("click",  modalSaveClick);
	// hide the error messages initially
	$(".form-group").removeClass("has-error");
	$(".form-group label").hide();

	// remove error message
	$("#newItNameId").bind("keyup", function(){
		var text = $(this).val();
		if(text != null && text != undefined && text != ""){
			$(this).closest(".form-group").removeClass("has-error");
			$(this).next("label")[0].style.display = "none";
		}
	});
}

function deleteVenueClicked(){
	var chosenIt = $(this).attr("itId").split("#")[1];
	var venueIndex = $(this).attr("itId").split("#")[2];
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
	// make the div scrollable
	$("#itNavDivId")[0].style.height = "600px";
	$("#itNavDivId")[0].style.overflowY = "scroll";

	$(function() {
    	$( ".sortableUL" ).sortable({
	    	start: function(event, ui) {
	            var start_pos = ui.item.index();
	            ui.item.data('start_pos', start_pos);
	        },
	        update: function(event, ui) {
	        	var itString = localStorage["itinerary"];
				var itList = JSON.parse(itString);

	        	var start_pos = ui.item.data('start_pos');
            	var newpos = ui.item.index();

            	var liList = ui.item.closest(".sortableUL").find("li");
            	// need to deep copy
            	var itListNew = $.extend(true, {}, itList);
            	// loop through the li and store the new elements at their new positions
            	// var newIndex = 0;
            	for (var newIndex in liList) {
            		if(newIndex == "length")
            			break;
            		var href = $(liList[newIndex]).find(".deleteVenue").attr("itId");
            		var itName = href.split("#")[1];
            		var originalIndex = href.split("#")[2];
            		// update the href
            		$(liList[newIndex]).find(".venueLink").attr("itId", "#" + itName + "#" + newIndex);
            		$(liList[newIndex]).find(".deleteVenue").attr("itId", "#" + itName + "#" + newIndex);

            		itListNew[itName][newIndex] = itList[itName][originalIndex];
            	}
            	localStorage["itinerary"] = JSON.stringify(itListNew);
            	plotSearchVenues(itListNew[itName]);
        	}
	    });
	    $( ".sortableUL" ).disableSelection();
	});
	$(".panel-title a.itLink").on("click", itClicked);
	$(".panel-title a.addItLink").on("click", addItClicked);
	$(".panel-title .deleteIt").on("click", deleteItClicked);
	$(".panel-title .animateIt").on("click", runITAnimation);
	$(".panel-body a.venueLink").on("click", venueClicked);
	$(".panel-body .deleteVenue").on("click", deleteVenueClicked);

	// trigger the click of the first itinerary
	$(".panel-title a.itLink")[0].click();
}