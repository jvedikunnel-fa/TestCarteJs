// example https://gist.github.com/d3noob/9267535/download#
// voir http://leafletjs.com/examples/quick-start.html
// voir http://wiki.openstreetmap.org/wiki/Nominatim
// voir http://derickrethans.nl/leaflet-and-nominatim.html

// paris Latitude : 48°51′12″ Nord	 Longitude : 2°20′55″ Est

 var map = L.map('map').setView([48.8534100, 2.3488000], 1);
        mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

	/* Initialize the SVG layer */
	map._initPathRoot()

	/* We simply pick up the SVG from the map object */
	var svg = d3.select("#map").select("svg"),
	g = svg.append("g");

	d3.json("json/circles.json", function(collection) {
		/*example:
{"objects":[
  {"circle":{"coordinates":[48.8514100,2.3448000]}},
  {"circle":{"coordinates":[48.8524100,2.3458000]}},
  {"circle":{"coordinates":[48.8534100,2.3468000]}},
  {"circle":{"coordinates":[48.8544100,2.3478000]}},
  {"circle":{"coordinates":[48.8554100,2.3488000]}}
]}
			*/
		collection.objects.forEach(function(d) {

			d.LatLng = new L.LatLng(d.circle.coordinates[0],
									d.circle.coordinates[1])
		})

		var feature = g.selectAll("circle")
			.data(collection.objects)
			.enter().append("circle")
			.style("stroke", "black")
			.style("opacity", .6)
			.style("fill", "red")
			.attr("r", 20);

		map.on("viewreset", update);
		update();

		function update() {
			feature.attr("transform",
			function(d) {
				return "translate("+
					map.latLngToLayerPoint(d.LatLng).x +","+
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
		}
	})

	d3.json("json/polygones.json", function(collection) {
	/*example:
{"objects":[
  {"polygone":{"coordinates":[
    [48.8544100,2.3488000],
    [48.8534100,2.3468000],
    [48.8554100,2.3478000]
  ]}},
  {"polygone":{"coordinates":[
    [48.8548100,2.3488000],
    [48.8534100,2.3428000],
    [48.8564100,2.3458000]
  ]}}
]}
        */
    		var feature = g.selectAll("polygon")
    			.data(collection.objects)
    			.enter().append("polygon")
    			.style("stroke", "purple")
    			.style("stroke-width", "1")
    			.style("opacity", .6)
    			.style("fill", "lime");

    		map.on("viewreset", update);
    		update();

    		function update() {
    			feature.attr("points",function(d) {
    				var coords = "";
    				for (var vari in d.polygone.coordinates){
    					var lat = d.polygone.coordinates[vari][0];
    					var long = d.polygone.coordinates[vari][1];
    					var latLng = new L.LatLng(lat,long );
    					var x = map.latLngToLayerPoint(latLng).x;
    					var y = map.latLngToLayerPoint(latLng).y;
    					coords += x+","+y+" ";
    				}
					return coords;
					}
				)

    	}})

	d3.json("json/markers.json", function(collection) {
	/*example:
{"objects":[
  {"marker":{"address":"7 rue de la fidélité 75010 Paris","message":"C'est chez moi"}},
  {"marker":{"coordinates":[48.8534100,2.3488000]}},
  {"marker":{"coordinates":[44.9544100,2.6481000],"message":"message 2"}},
  {"marker":{"coordinates":[43.2564100,2.7428000],"message":"message 3"}},
  {"marker":{"coordinates":[48.4574100,2.8448000],"message":"message 4"}}
]}
		*/
			collection.objects.forEach(function(d) {
					var markerFromJson = d.marker;
					if (markerFromJson.coordinates!=null){
						var lat = markerFromJson.coordinates[0];
                    	var long = markerFromJson.coordinates[1];
                    	var marker = L.marker([lat, long]).addTo(map);
                    	addMessagePopup(marker,markerFromJson.message);
					}else if (markerFromJson.address != null){
						var addressFromJson = markerFromJson.address;
						// for a larger requirements use MapQuest Open, OpenCage Geocoder
						$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + encodeURIComponent(addressFromJson), function(data) {
								$.each(data, function(key, val) {
									var lat = val.lat;
									var long = val.lon;
									var marker = L.marker([lat, long]).addTo(map);
									addMessagePopup(marker,markerFromJson.message);
								});
							});
					}else{
						alert("Json Marker Error: missing either address or coordinates");
					}
        		})
    	})

    function addMessagePopup(marker, msg){
		if (msg != null){
			marker.bindPopup(msg).openPopup();
		}
    }