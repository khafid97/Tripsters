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
	var itList = {};
	var itString = localStorage["itinerary"];
	if (itString != undefined && itString != '')
		itList = JSON.parse(itString);

	var newIt = $("#newItNameId").val();
	newIt = newIt.replace(/ /g, ":");
	// show error in case mepty itinerary
	if(newIt == "" || newIt == undefined || newIt == null){
		$("#newItNameId").closest(".form-group").addClass("has-error");
		$("#newItNameId").next("label")[0].style.display = "block";
		return;
	}

	itList[newIt] = [];
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
			renderIt(true);
			plotSearchVenues(itList[chosenIt], "false", true);
			// expands the required itinerary
			var divId = "#id" + chosenIt.replace(/:/g, "");
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
function renderIt(triggerOff){
	var itString = localStorage["itinerary"];
	var itList = [];
	if (itString != undefined && itString != '')
		itList = JSON.parse(itString);


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
	if(triggerOff)
		return;
	var firstIt = $(".panel-title a.itLink");
	if (firstIt == undefined || firstIt == [] || firstIt.length == 0 || firstIt == {}) {
		plotSearchVenues([]);
	}
	else {
		firstIt[0].click();
	}
}