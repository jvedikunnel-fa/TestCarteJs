L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.ClientFaController = L.Class.extend({
    initialize : function (map, options) {
        this._map = map; 
        this._options = options;
    },
    tock : function(annee){
        if (this._clientFas.aAuMoinsUneLatLng(annee)){
            var latlngs = this._clientFas.trouverLatLngsPour(annee);
            this.charger(latlngs);
        }
    },
    charger : function (latlngs) {
        for (var i = 0, len = latlngs.length; i < len; i++) {
            L.marker([latlngs[i][0], latlngs[i][1]], {bounceOnAdd: true}).addTo(this._map);
        }
    },
    clearData : function () {
       // this._clientFas = clientFas;
    },
    addData : function (clientFas) {
        this._clientFas = clientFas;
    }
});

//L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.ClientFas = L.Class.extend({
    initialize : function (geoJSON, options) {
        this._geoJSON = geoJSON;
        this._annees = geoJSON.properties.annees;
        this._villes = geoJSON.properties.villes;
        this._coordinates = geoJSON.geometry.coordinates;
    },
    aAuMoinsUneLatLng : function(annee){
        var trouve = false;
        for (var i = 0, len = this._annees.length; i < len; i++) {
            if (this._annees[i] === annee){
                trouve = true;
                break;
            }
        }
        return trouve;
    },
    trouverLatLngsPour : function(annee){
        var latlngs = [];
        for (var i = 0, len = this._annees.length; i < len; i++) {
            if (this._annees[i] === annee){
                latlngs.push(this._coordinates[i]);
            }
        }
        return latlngs;
    }
});

//L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.Clock = L.Class.extend({

    initialize: function (clientFaController, callback, options) {
        this._clientFaController = clientFaController;
        this._cursor = 2005; // TODO trouver la première année
        this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs = options.tempsDAttenteEntreDeuxAjoutDeMarkerEnMs;
    },
    _tick: function (self) {
        self._clientFaController.tock(self._cursor);
        self._cursor += 1;
    },
    start: function () {
        this._intervalID = window.setInterval(
            this._tick,
            this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs,
            this
        );
    },


});

L.FAClientRetrospective = L.FAClientRetrospective.Clock.extend({
    statics : {
        ClientFaController : L.FAClientRetrospective.ClientFaController,
        ClientFas : L.FAClientRetrospective.ClientFas,
        Clock : L.FAClientRetrospective.Clock
    },
    options : {
        tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 3000
    },
    initialize : function (map, geoJSON, callback, options) {
        L.setOptions(this, options);
        this._map = map;
        this._clientFaController = new L.FAClientRetrospective.ClientFaController(map, this.options);
        L.FAClientRetrospective.Clock.prototype.initialize.call(this, this._clientFaController, callback, this.options);
        this.setData(geoJSON);  
        this.start(); // TODO lier l'action start à un bouton
    },
    clearData : function(){
        this._clientFaController.clear();
    },
    setData : function (geoJSON) {
        this.clearData();
        this.addData(geoJSON);
    },
    clearData : function (geoJSON) {
        this._clientFaController.clearData();
    },
    addData : function (geoJSON) {
        // return if data not set
        if (!geoJSON){
            return;
        }
        this._clientFaController.addData(new L.FAClientRetrospective.ClientFas(geoJSON, this.options));
    }
    });

/*L.Map.addInitHook(function () {
    if (this.options.fAClientRetrospective) {
        this.fAClientRetrospective = new L.FAClientRetrospective(this);
    }
});*/
/*

L.FAClientRetrospective = function (map, geoJSON, callback, options) {
    return new L.FAClientRetrospective(map, geoJSON, callback, options);
};*/
