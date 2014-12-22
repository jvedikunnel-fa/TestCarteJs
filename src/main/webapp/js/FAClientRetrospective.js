L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.PlayControl = L.Control.extend({
    options : {
        position : 'bottomright'
    },

    initialize : function (fAClientRetrospective) {
        this.fAClientRetrospective = fAClientRetrospective;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded');

        var self = this;
        var fAClientRetrospective = this.fAClientRetrospective;

        var playControl = L.DomUtil.create('div', 'playControl', this._container);


        this._button = L.DomUtil.create('button', '', playControl);
        this._button.innerHTML = 'Play';


        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
        .on(this._button, 'click', stop)
        .on(this._button, 'mousedown', stop)
        .on(this._button, 'dblclick', stop)
        .on(this._button, 'click', L.DomEvent.preventDefault)
        .on(this._button, 'click', play, this);

        function play(){
            if (fAClientRetrospective.isPlaying()){
                fAClientRetrospective.stop();
                self._button.innerHTML = 'Play';
            }
            else {
                fAClientRetrospective.start();
                self._button.innerHTML = 'Stop';
            }
        }

        return this._container;
    }
});

L.FAClientRetrospective.ClientFaController = L.Class.extend({
    initialize : function (map, options) {
        this._map = map; 
        this._options = options;
        this._clientFas = null;
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
    stop: function () {
        if (!this._intervalID) return;
        clearInterval(this._intervalID);
        this._intervalID = null;
    },
    isPlaying: function() {
        return this._intervalID ? true : false;
    }
});

L.FAClientRetrospective = L.FAClientRetrospective.Clock.extend({
    statics : {
        ClientFaController : L.FAClientRetrospective.ClientFaController,
        ClientFas : L.FAClientRetrospective.ClientFas,
        Clock : L.FAClientRetrospective.Clock,      
        PlayControl : L.FAClientRetrospective.PlayControl
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
        
        this.playControl = new L.FAClientRetrospective.PlayControl(this);
        this.playControl.addTo(map);
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
