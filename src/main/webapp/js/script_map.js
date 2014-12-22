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
		tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 3000,
		anneeDeDepart : 2005,
		anneeDeFin : 2015,
		dateControl : true,
		sliderControl : true
		// TODO
    };
    // Initialize playback
    var fAClientRetrospective = new L.FAClientRetrospective(map, data, null, fAClientRetrospectiveOptions);
});