// example https://gist.github.com/d3noob/9267535/download#
// voir http://leafletjs.com/examples/quick-start.html
 var map = L.map('map').setView([-41.2858, 174.7868], 13);
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
			collection.objects.forEach(function(d) {
					var lat = d.marker.coordinates[0];
					var long = d.marker.coordinates[1];
					var marker = L.marker([lat, long]).addTo(map);
					var msg = d.marker.message;
					if (msg != null){
						marker.bindPopup(msg).openPopup();
					}
        		})
    	})