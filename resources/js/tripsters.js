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
	  renderResults(reply);
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