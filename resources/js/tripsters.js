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
	  //console.log(reply.response.venues);
	  renderResults(reply, "search");
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
		 console.log(reply);

	  plotVenues(reply);
	  	  //renderResults(reply, "explore");

	});
}

function plotVenues(data){
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