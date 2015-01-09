$(function() {
    // Setup leaflet map
     var map = L.map('map').setView([48.8534100, 2.3488000], 4);
            mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                //'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png', {
                'http://www.komoot.de/tiles/b/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
                }).addTo(map);

    // =====================================================
    // =============== FAClientRetrospective ============================
    // =====================================================

    // Playback options
    var fAClientRetrospectiveOptions = {
		tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 1 * 500,
		anneeDeDepart : 2003,
		anneeDeFin : 2015,
		dateControl : true,
		sliderControl : true,
		mapClickInfo : true
		// TODO
    };
    // Initialize playback
    var fAClientRetrospective = new L.FAClientRetrospective(map, data_insito_aliance, null, fAClientRetrospectiveOptions);
});