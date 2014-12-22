L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.Util = L.Class.extend({
  statics: {

    DateStr: function(annee) {
      return "Année: " + annee;
    }
  }

});

L.FAClientRetrospective.DateControl = L.Control.extend({
    options : {
        position : 'bottomleft'
    },

    initialize : function (fAClientRetrospective) {
        this.fAClientRetrospective = fAClientRetrospective;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded');

        var self = this;
        var fAClientRetrospective = this.fAClientRetrospective;
        var anneeCourante = fAClientRetrospective.getAnneeCourante();

        var datetime = L.DomUtil.create('div', 'datetimeControl', this._container);

        // date time
        this._date = L.DomUtil.create('p', '', datetime);

        this._date.innerHTML = L.FAClientRetrospective.Util.DateStr(anneeCourante);

        // setup callback
        fAClientRetrospective.addCallback(function (anneeCourante) {
            self._date.innerHTML = L.FAClientRetrospective.Util.DateStr(anneeCourante);
        });

        return this._container;
    }
});

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
            var villes = this._clientFas.trouverLesVillesPour(annee);
            this.charger(latlngs, villes);
        }
    },
    charger : function (latlngs, villes) {
        for (var i = 0, len = latlngs.length; i < len; i++) {
            var marker = L.marker([latlngs[i][0], latlngs[i][1]], {bounceOnAdd: true}).addTo(this._map);
            marker.bindPopup(villes[i]);
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
    },
    trouverLesVillesPour : function(annee){
        var villes = [];
        for (var i = 0, len = this._annees.length; i < len; i++) {
            if (this._annees[i] === annee){
                villes.push(this._villes[i]);
            }
        }
        return villes;
    }
});

L.FAClientRetrospective.Clock = L.Class.extend({

    initialize: function (clientFaController, callback, options) {
        this._callbacksArry = [];
        if (callback) this.addCallback(callback);
        this._clientFaController = clientFaController;
        this._anneeCourante = options.anneeDeDepart; // TODO trouver la première année
        this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs = options.tempsDAttenteEntreDeuxAjoutDeMarkerEnMs;
    },
    _callbacks: function(anneeCourante) {
        var arry = this._callbacksArry;
        for(var i=0, len=arry.length; i<len; i++){
            arry[i](anneeCourante);
       }
    },
    addCallback: function(fn) {
        this._callbacksArry.push(fn);
    },
    _tick: function (self) {
        self._clientFaController.tock(self._anneeCourante);
        self._anneeCourante += 1;
        self._callbacks(self._anneeCourante);
    },
    start: function () {
        this._intervalID = window.setInterval(
            this._tick,
            this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs,
            this
        );
    }, 
    getAnneeCourante: function() {
        return this._anneeCourante;
      },
    stop: function () {
        if (!this._intervalID) return;
        clearInterval(this._intervalID);
        this._intervalID = null;
    },
    isPlaying: function() {
        return this._intervalID ? true : false;
    },
    setAnneeDeDepart : function (anneeCourante) {
        this._callbacks(anneeCourante);
      },
});

L.FAClientRetrospective = L.FAClientRetrospective.Clock.extend({
    statics : {
        ClientFaController : L.FAClientRetrospective.ClientFaController,
        ClientFas : L.FAClientRetrospective.ClientFas,
        Clock : L.FAClientRetrospective.Clock,      
        PlayControl : L.FAClientRetrospective.PlayControl,
        DateControl : L.FAClientRetrospective.DateControl,
        Util : L.FAClientRetrospective.Util
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
        
        if (this.options.dateControl) {
            this.dateControl = new L.FAClientRetrospective.DateControl(this);
            this.dateControl.addTo(map);
        }
    },
    clearData : function(){
        this._clientFaController.clear();
    },
    setData : function (geoJSON) {
        this.clearData();
        this.addData(geoJSON);
        this.setAnneeDeDepart(this.options.anneeDeDepart);
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
