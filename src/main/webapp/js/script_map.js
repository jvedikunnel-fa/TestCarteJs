$(function() {
    // Setup leaflet map
     var map = L.map('map').setView([48.8534100, 2.3488000], 4);
            mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                // 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                //'http://www.komoot.de/tiles/a/{z}/{x}/{y}.png', {
                'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
                }).addTo(map);

    // =====================================================
    // =============== FAClientRetrospective ============================
    // =====================================================

    // Playback options
    var fAClientRetrospectiveOptions = {
		bounceOnAddDuration : 1 * 1000, // temps de chute pour un marker
		tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 0.25 * 1000,
		anneeMoisDeDepart : "2003-01",
		anneeMoisDeFin :"2015-01",
		titleLegende : false,
		dateControl : true,
		sliderControl : false,
		mapClickInfo : false
		
		// TODO ajouter d'autres options
    };
    // Initialize playback
    var fAClientRetrospective = new L.FAClientRetrospective(map, data_insito_aliance, null, fAClientRetrospectiveOptions);
});