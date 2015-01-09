L.FAClientRetrospective = L.FAClientRetrospective || {};

L.FAClientRetrospective.Util = L.Class.extend({
    statics: {
        DateStr: function(anneeMois) {
            var split = anneeMois.split("-");
            var annee = parseInt(split[0],10);
            var mois = parseInt(split[1],10);
            var moisDeLAnnee = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
            return annee + " - " + moisDeLAnnee[mois-1];
        }
    }

});

L.FAClientRetrospective.MapClickInfo =  L.Class.extend({
    initialize : function (map) {
        this._map = map;
        this._map.on('click', this._onMapClick, this);
    },
    _onMapClick : function (e) {
        L.popup()
            .setLatLng(e.latlng)
            .setContent("Le futur client de Fa se trouve là: " + e.latlng.toString())
            .openOn(this._map);
    }
});

L.FAClientRetrospective.CouleurMarker = L.Class.extend({
    statics: {
        couleurParDefaut_insito : "#D1E0FF",
        couleurParDefaut_inviseo : "#C2F0F0",
        couleurParDefaut_alliance : "#FFCACA",
        couleurParDefaut_previsio : "#FFCACA", // TODO à remplacer par une autre couleur
        trouverCouleur : function (type, anneeMois) {
            var split = anneeMois.split("-");
            var annee = parseInt(split[0],10);
            for (var i = 0, len = backgroundColor.length; i < len; i++) {
                if (backgroundColor[i].annee === annee && backgroundColor[i].type === type){
                    return backgroundColor[i].couleur;
                }
            }
            if (type === "insito"){
                return this.couleurParDefaut_insito;
            } else if (type === "alliance"){
                return this.couleurParDefaut_inviseo;
            } else if (type === "inviseo"){
                return this.couleurParDefaut_alliance;
            } else if (type === "previsio"){
                return this.couleurParDefaut_previsio;
            } else {
                alert("Type non reconnu: " + type);
            }

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
        var anneeMoisCourante = fAClientRetrospective.getAnneeMoisCourante();

        var datetime = L.DomUtil.create('div', 'datetimeControl', this._container);

        // date time
        this._date = L.DomUtil.create('p', '', datetime);

        this._date.innerHTML = L.FAClientRetrospective.Util.DateStr(anneeMoisCourante);

        // setup callback
        fAClientRetrospective.addCallback(function (anneeMoisCourante) {
            self._date.innerHTML = L.FAClientRetrospective.Util.DateStr(anneeMoisCourante);
        });

        return this._container;
    }
});

L.FAClientRetrospective.TitleLegende = L.Control.extend({
    options : {
        position : 'topleft'
    },

    initialize : function (fAClientRetrospective) {
        this.fAClientRetrospective = fAClientRetrospective;
    },

    onAdd : function (map) {
        this._container = L.DomUtil.create('div', 'info legend'),
            labels = ['<h1><strong> Rétrospective Clients FA </strong></h1>'];

        labels.push('<h3><i style="background:#D1E0FF"></i>Insito</h3>');
        labels.push('<h3><i style="background:#FFCACA"></i>Alliance</h3>');
        labels.push('<h3><i style="background:#C2F0F0"></i>Inviseo</h3>');
        labels.push('<h3><i style="background:#FFCACA"></i>Previsio</h3>');// TODO mettre la bonne couleur
        this._container.innerHTML=labels.join('<br>');
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
        this._slider.min = 2000*12+1; // todo calculer l'année de départ
        this._slider.max = 2015*12+1; // todo calculer l'année de fin
        this._slider.value = 2000*12+1;

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

        fAClientRetrospective.addCallback(function (anneeMois) {
            var split = anneeMois.split("-");
            var annee = parseInt(split[0],10);
            var mois = parseInt(split[1],10);
            self._slider.value = annee*12+mois;
        });
        return this._container;
    }
});

L.FAClientRetrospective.ClientFaController = L.Class.extend({
    initialize : function (map, options) {
        this._map = map;
        this._options = options;
        this._clientFas = null;
    },
    tock : function(anneeMois){
        if (this._clientFas.aAuMoinsUneLatLng(anneeMois)){
            var latlngs = this._clientFas.trouverLatLngsPour(anneeMois);
            var villes = this._clientFas.trouverLesVillesPour(anneeMois);
            var types = this._clientFas.trouverLesTypesPour(anneeMois);
            this.charger(anneeMois, latlngs, villes, types);
        }
    },
    charger : function (anneeMois, latlngs, villes, types) {
        var markerW=3;
        var markerH=3;
        for (var i = 0, len = latlngs.length; i < len; i++) {
            var myIcon="";
            if (types[i] === "insito"){
                myIcon = L.divIcon({
                        className: 'client-fa-marker-insito-icon',
                        iconSize: [markerW, markerH]
                    });
            } else if (types[i] === "alliance"){
                myIcon = L.divIcon({
                        className: 'client-fa-marker-alliance-icon',
                        iconSize: [markerW, markerH]
                    });
            } else if (types[i] === "inviseo"){
                myIcon = L.divIcon({
                        className: 'client-fa-marker-inviseo-icon',
                        iconSize: [markerW, markerH]
                    });
            } else if (types[i] === "previsio"){
                myIcon = L.divIcon({
                        className: 'client-fa-marker-previsio-icon',
                        iconSize: [markerW, markerH]
                    });
            } else {
                alert("Type non reconnu: " + types[i]);
            }
            var marker = L.marker([latlngs[i][0], latlngs[i][1]], {bounceOnAdd: false, bounceOnAddDuration:this._options.bounceOnAddDuration, icon: myIcon}).addTo(this._map)
            marker.valueOf()._icon.style.backgroundColor = L.FAClientRetrospective.CouleurMarker.trouverCouleur(types[i],
            anneeMois);
            var msgPopup = types[i] + " : " + villes[i] + " - " + anneeMois;
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
        var clientFas = [];
        var anneeMoiss = geoJSON.properties.anneeMoiss;
        var villes = geoJSON.properties.villes;
        var types = geoJSON.properties.types;
        var coordinates = geoJSON.geometry.coordinates;
        for (var i = 0, len = coordinates.length; i < len; i++) {
            clientFas.push(new clientFa(coordinates[i], anneeMoiss[i], villes[i], types[i]));
        }
        return clientFas;
    },
    aAuMoinsUneLatLng : function(anneeMois){
        var trouve = false;
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            var anneeMoisATrouve = extraireAnneeMoisDe(this._clientFas[i].anneeMois)
            if (anneeMoisATrouve === anneeMois){
                trouve = true;
                break;
            }
        }
        return trouve;
    },
    trouverLatLngsPour : function(anneeMois){
        var latlngs = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            var anneeMoisATrouve = extraireAnneeMoisDe(this._clientFas[i].anneeMois)
            if (anneeMoisATrouve === anneeMois){
                latlngs.push(this._clientFas[i].coordonnee);
            }
        }
        return latlngs;
    },
    trouverLesVillesPour : function(anneeMois){
        var villes = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            var anneeMoisATrouve = extraireAnneeMoisDe(this._clientFas[i].anneeMois)
            if (anneeMoisATrouve === anneeMois){
                villes.push(this._clientFas[i].ville);
            }
        }
        return villes;
    },
    trouverLesTypesPour : function(anneeMois){
        var types = [];
        for (var i = 0, len = this._clientFas.length; i < len; i++) {
            var anneeMoisATrouve = extraireAnneeMoisDe(this._clientFas[i].anneeMois)
            if (anneeMoisATrouve === anneeMois){
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
        this._anneeMoisCourante = options.anneeMoisDeDepart;
        this._anneeMoisDeFin = options.anneeMoisDeFin;
        this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs = options.tempsDAttenteEntreDeuxAjoutDeMarkerEnMs;
    },
    callbacks: function(anneeMoisCourante) {
        var arry = this._callbacksArry;
        for(var i=0, len=arry.length; i<len; i++){
            arry[i](anneeMoisCourante);
       }
    },
    addCallback: function(fn) {
        this._callbacksArry.push(fn);
    },
    _tick: function (self) {
        if (self._anneeMoisCourante > self._anneeMoisDeFin){
            self.stopPlayButton();
            return;
        }
        self._clientFaController.tock(self._anneeMoisCourante);
        self.callbacks(self._anneeMoisCourante);

        function ajouterUnMois(self){
            var split = self._anneeMoisCourante.split("-");
            var annee = parseInt(split[0],10);
            var mois = parseInt(split[1],10);
            var nouvelleAnnee = annee;
            var nouveauMois = mois;
            if (mois === 12){
                nouvelleAnnee += 1;
                nouveauMois = 1;
            }else{
                nouveauMois += 1;
            }
            if (nouveauMois<10){
                nouveauMois = "0" + nouveauMois;
            }
            self._anneeMoisCourante = nouvelleAnnee + "-" + nouveauMois;
        }

        ajouterUnMois(self);
    },
    start: function () {
        this._intervalID = window.setInterval(
            this._tick,
            this._tempsDAttenteEntreDeuxAjoutDeMarkerEnMs,
            this
        );
    },
    getAnneeMoisCourante: function() {
        return this._anneeMoisCourante;
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
        SliderControl : L.FAClientRetrospective.SliderControl,
        MapClickInfo : L.FAClientRetrospective.MapClickInfo,
        TitleLegende : L.FAClientRetrospective.TitleLegende
    },
    options : {
        tempsDAttenteEntreDeuxAjoutDeMarkerEnMs : 3 * 000
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
        if (this.options.mapClickInfo) {
            this.mapClickInfo = new L.FAClientRetrospective.MapClickInfo(map);
        }
        if (this.options.titleLegende) {
            this.titleLegende = new L.FAClientRetrospective.TitleLegende(this);
            this.titleLegende.addTo(map);
        }
    },
    clearData : function(){
        this._clientFaController.clear();
    },
    setData : function (geoJSON) {
        this.clearData();
        this.addData(geoJSON);
        this.callbacks(this.options.anneeMoisDeDepart);
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

function clientFa(coordonnee, anneeMois, ville, type) {
    this.coordonnee = coordonnee;
    this.anneeMois = anneeMois;
    this.ville = ville;
    this.type = type;
}

function extraireAnneeMoisDe(dateATraiter) {
    if (dateATraiter.split("-").length > 2){
        var split = dateATraiter.split("-");
        dateATraiter = split[0] + "-" + split[1];
    }
    return dateATraiter;
}