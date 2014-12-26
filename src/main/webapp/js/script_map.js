$(function() {
    // Setup leaflet map
     var map = L.map('map').setView([48.8534100, 2.3488000], 4);
            mapLink =
                '<a href="http://openstreetmap.org">OpenStreetMap</a>';
            L.tileLayer(
                'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18,
                }).addTo(map);

    // =====================================================
    // =============== FAClientRetrospective ============================
    // =====================================================

    // Playback options
    var fAClientRetrospectiveOptions = {
		bounceOnAddDuration : 1 * 1000, // temps de chute pour un marker
		tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 1 * 1000,
		anneeDeDepart : 2007,
		anneeDeFin : 2015,
		titleLegende : true,
		dateControl : true,
		sliderControl : true,
		mapClickInfo : false
		
		// TODO ajouter d'autres options
    };
    // Initialize playback
    var fAClientRetrospective = new L.FAClientRetrospective(map, data_fa, null, fAClientRetrospectiveOptions);
});