L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.Util = L.Class.extend({
  statics: {
    DateStr: function(annee) {
      return "Année: " + annee;
    }
  }

});

L.FAClientRetrospective.CouleurMarker = L.Class.extend({
    statics: {
        couleurParDefaut_inviseo : "#E0EBFF",
        couleurParDefaut_insito : "#FFDCDC",
        trouverCouleur : function (type, annee) {
            function anneeCouleur(type, annee, couleur) {
                this.type = type;
                this.annee = annee;
                this.couleur = couleur;
            }
            // http://www.w3schools.com/tags/ref_colorpicker.asp
            var backgroundColor = [
                                new anneeCouleur("insito", 2000,"#FFCACA"),
                                new anneeCouleur("insito", 2001,"#FFCACA"),
                                new anneeCouleur("insito", 2002,"#FFCACA"),
                                new anneeCouleur("insito", 2003,"#FFCACA"),
                                new anneeCouleur("insito", 2004,"#FFCACA"),
                                new anneeCouleur("insito", 2005,"#FFCACA"),
                                new anneeCouleur("insito", 2006,"#FFB9B9"),
                                new anneeCouleur("insito", 2007,"#FFA8A8"),
                                new anneeCouleur("insito", 2008,"#FF9696"),
                                new anneeCouleur("insito", 2009,"#FF8484"),
                                new anneeCouleur("insito", 2010,"#FF7373"),
                                new anneeCouleur("insito", 2011,"#FF6262"),
                                new anneeCouleur("insito", 2012,"#FF5050"),
                                new anneeCouleur("insito", 2013,"#E64848"),
                                new anneeCouleur("insito", 2014,"#CC4040"),
                                
                                new anneeCouleur("inviseo", 2000,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2001,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2002,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2003,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2004,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2005,"#D1E0FF"),
                                new anneeCouleur("inviseo", 2006,"#C2D6FF"),
                                new anneeCouleur("inviseo", 2007,"#B2CCFF"),
                                new anneeCouleur("inviseo", 2008,"#A3C2FF"),
                                new anneeCouleur("inviseo", 2009,"#94B8FF"),
                                new anneeCouleur("inviseo", 2010,"#85ADFF"),
                                new anneeCouleur("inviseo", 2011,"#75A3FF"),
                                new anneeCouleur("inviseo", 2012,"#6699FF"),
                                new anneeCouleur("inviseo", 2013,"#5C8AE6"),
                                new anneeCouleur("inviseo", 2014,"#527ACC")
                                ];
            for (var i = 0, len = backgroundColor.length; i < len; i++) {
                if (backgroundColor[i].annee === annee && backgroundColor[i].type === type){
                    return backgroundColor[i].couleur;
                }
            }
            return this.couleurParDefaut;
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
    },
    stop : function(){
        this._button.innerHTML = 'Play';
    }
});

L.FAClientRetrospective.SliderControl = L.Control.extend({
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

        // slider
        this._slider = L.DomUtil.create('input', 'slider', this._container);
        this._slider.type = 'range';
        this._slider.min = 2006;
        this._slider.max = 2015;
        this._slider.value = 2006;

        var stop = L.DomEvent.stopPropagation;

        L.DomEvent
        .on(this._slider, 'click', stop)
        .on(this._slider, 'mousedown', stop)
        .on(this._slider, 'dblclick', stop)
        .on(this._slider, 'click', L.DomEvent.preventDefault)
        //.on(this._slider, 'mousemove', L.DomEvent.preventDefault)
        .on(this._slider, 'change', onSliderChange, this)
        .on(this._slider, 'mousemove', onSliderChange, this);


        function onSliderChange(e) {
            var val = Number(e.target.value);
            // TODO do something with it
        }

        fAClientRetrospective.addCallback(function (ms) {
            self._slider.value = ms;
        });


        /*map.on('playback:add_tracks', function(){
            self._slider.min = playback.getStartTime();
            self._slider.max = playback.getEndTime();
            self._slider.value = playback.getTime();
        });*/

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
            var types = this._clientFas.trouverLesTypesPour(annee);
            this.charger(annee, latlngs, villes, types);
        }
    },
    charger : function (annee, latlngs, villes, types) {
        var myIcon = L.divIcon({
            className: 'client-fa-marker-icon',
            iconSize: [13, 13]
        });
        for (var i = 0, len = latlngs.length; i < len; i++) {
            var myIcon="";
            if (types[i] === "inviseo"){
                myIcon = L.divIcon({
                        className: 'client-fa-marker-inviseo-icon',
                        iconSize: [13, 13]
                    });
            }else {
                myIcon = L.divIcon({
                    className: 'client-fa-marker-insito-icon',
                    iconSize: [13, 13]
                });
            }
            var marker = L.marker([latlngs[i][0], latlngs[i][1]], {bounceOnAdd: true, icon: myIcon}).addTo(this._map)
            marker.valueOf()._icon.style.backgroundColor = L.FAClientRetrospective.CouleurMarker.trouverCouleur(types[i], 
            annee);
            var msgPopup = types[i] + " : " + villes[i] + " - " + annee;
            marker.bindPopup(msgPopup);
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
        this._clientFas = this.charger(geoJSON);
    },
    charger : function (geoJSON){
        var clientFas = []
        var annees = geoJSON.properties.annees;
        var villes = geoJSON.properties.villes;
        var types = geoJSON.properties.types;
        var coordinates = geoJSON.geometry.coordinates;
        for (var i = 0, len = coordinates.length; i < len; i++) {
            clientFas.push(new clientFa(coordinates[i], annees[i], villes[i], types[i]));
        }
        return clientFas;
    },
    aAuMoinsUneLatLng : function(annee){
        var trouve = false;
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            if (this._clientFas[i].annee === annee){
                trouve = true;
                break;
            }
        }
        return trouve;
    },
    trouverLatLngsPour : function(annee){
        var latlngs = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            if (this._clientFas[i].annee === annee){
                latlngs.push(this._clientFas[i].coordonnee);
            }
        }
        return latlngs;
    },
    trouverLesVillesPour : function(annee){
        var villes = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            if (this._clientFas[i].annee === annee){
                villes.push(this._clientFas[i].ville);
            }
        }
        return villes;
    },
    trouverLesTypesPour : function(annee){
        var types = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            if (this._clientFas[i].annee === annee){
                types.push(this._clientFas[i].type);
            }
        }
        return types;
    }
});

L.FAClientRetrospective.Clock = L.Class.extend({

    initialize: function (clientFaController, callback, options) {
        this._callbacksArry = [];
        if (callback) this.addCallback(callback);
        this._clientFaController = clientFaController;
        this._anneeCourante = options.anneeDeDepart;
        this._anneeDeFin = options.anneeDeFin;
        this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs = options.tempsDAttenteEntreDeuxAjoutDeMarkerEnMs;
    },
    callbacks: function(anneeCourante) {
        var arry = this._callbacksArry;
        for(var i=0, len=arry.length; i<len; i++){
            arry[i](anneeCourante);
       }
    },
    addCallback: function(fn) {
        this._callbacksArry.push(fn);
    },
    _tick: function (self) {
        if (self._anneeCourante > self._anneeDeFin){
            self.stopPlayButton();
            return;
        }
        self._clientFaController.tock(self._anneeCourante);
        self.callbacks(self._anneeCourante);
        self._anneeCourante += 1;
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
    }
});

L.FAClientRetrospective = L.FAClientRetrospective.Clock.extend({
    statics : {
        ClientFaController : L.FAClientRetrospective.ClientFaController,
        ClientFas : L.FAClientRetrospective.ClientFas,
        Clock : L.FAClientRetrospective.Clock,      
        PlayControl : L.FAClientRetrospective.PlayControl,
        DateControl : L.FAClientRetrospective.DateControl,
        Util : L.FAClientRetrospective.Util,
        CouleurMarker : L.FAClientRetrospective.CouleurMarker,
        SliderControl : L.FAClientRetrospective.SliderControl
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
        
        this._playControl = new L.FAClientRetrospective.PlayControl(this);
        this._playControl.addTo(map);
        
        if (this.options.dateControl) {
            this.dateControl = new L.FAClientRetrospective.DateControl(this);
            this.dateControl.addTo(map);
        }
        
        if (this.options.sliderControl) {
            this.sliderControl = new L.FAClientRetrospective.SliderControl(this);
            this.sliderControl.addTo(map);
        }
    },
    clearData : function(){
        this._clientFaController.clear();
    },
    setData : function (geoJSON) {
        this.clearData();
        this.addData(geoJSON);
        this.callbacks(this.options.anneeDeDepart);
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
    },
    stopPlayButton : function (){
        this._playControl.stop();
    }
});

function clientFa(coordonnee, annee, ville, type) {
    this.coordonnee = coordonnee;
    this.annee = annee;
    this.ville = ville;
    this.type = type;
}