/**
 * Created by tiwen.wang on 6/2/2015.
 */
(function() {

    var L = window.L || {};
L.Control.LayersManager = L.Control.Layers.extend({
    initialize: function (options) {
        var self = this;
        L.Control.Layers.prototype.initialize.call(this, options);
        self._layers = {};
        this.maps = {};
    },
    onAdd: function(map) {
        var container = L.Control.Layers.prototype.onAdd.call(this, map);

        for(var id in this.maps) {
            if(this.maps[id].map) {
                this.addMap(this.maps[id].map);
            }
        }

        this._activeBaseLayer = this._findActiveBaseLayer();
        this._activeOverlayLayers = this._findActiveOverlayLayers();
        return container;
    },
    onRemove: function() {
        var self = this;
        if(this._baseLayer) {
            self._map.removeLayer(this._baseLayer);
        }
        for(var key in self._overLayer) {
            self._map.addLayer(self._overLayer[key]);
        }
    },
    _findActiveBaseLayer: function () {
        var layers = this._layers;
        for (var layerId in layers) {
            if (this._layers.hasOwnProperty(layerId)) {
                var layer = layers[layerId];
                if (!layer.overlay && this._map.hasLayer(layer.layer)) {
                    return layer;
                }
            }
        }
        //throw new Error('Control doesn\'t have any active base layer!');
    },

    _findActiveOverlayLayers: function () {
        var result = {};
        var layers = this._layers;
        for (var layerId in layers) {
            if (this._layers.hasOwnProperty(layerId)) {
                var layer = layers[layerId];
                if (layer.overlay && this._map.hasLayer(layer.layer)) {
                    result[layerId] = layer;
                }
            }
        }
        return result;
    },

    _onLayerChange: function () {
        L.Control.Layers.prototype._onLayerChange.apply(this, arguments);
        this._recountLayers();
    },

    _onInputClick: function () {
        this._handlingClick = true;

        var _activeBaseLayer = this._activeBaseLayer;
        this._recountLayers();
        L.Control.Layers.prototype._onInputClick.call(this);

        if(_activeBaseLayer.layer !== this._activeBaseLayer.layer) {
            this.activeBaseLayer(this._activeBaseLayer.layer);
        }

        this._handlingClick = false;
    },

    _recountLayers: function () {
        var i, input, obj,
            inputs = this._form.getElementsByTagName('input'),
            inputsLen = inputs.length;

        for (i = 0; i < inputsLen; i++) {
            input = inputs[i];
            obj = this._layers[input.layerId];

            if (input.checked) {
                if (obj.overlay) {
                    this._activeOverlayLayers[input.layerId] = obj;
                } else {
                    this._activeBaseLayer = obj;
                }
            } else if (!input.checked && this._map.hasLayer(obj.layer)) {
                if (obj.overlay) {
                    delete this._activeOverlayLayers[input.layerId];
                }
            }
        }
    },
    addMap: function(map) {
        if(!this._map) {
            this.maps[map.id] = {
               map: map
            };
        }else {
            if(!this.maps[map.id]||!this.maps[map.id].baseLayer) {
                var baseLayer = L.tileLayer.provider(map.baseLayer);
                this.addBaseLayer(baseLayer, map.name);
                var overLayers = {};
                if(map.overLayers) {
                    for(var name in map.overLayers) {
                        var overLayer = L.tileLayer.provider(map.overLayers[name]);
                        //this.addOverlay(overLayer, name);
                        overLayers[name] = overLayer;
                    }
                }
                this.maps[map.id] = {
                    baseLayer: baseLayer,
                    overLayers: overLayers
                };
            }
            this.activeMap(this.maps[map.id]);
        }
    },
    activeBaseLayer: function(baseLayer) {
        var mapLayers, name;

        for(name in this.maps) {
            if(this.maps[name].baseLayer === baseLayer) {
                mapLayers = this.maps[name];
            }
        }

        this.activeMap(mapLayers);

    },
    activeMap: function(mapLayers) {
        if(!mapLayers) {
            return;
        }
        var baseLayer = mapLayers.baseLayer,
            name;
        if(!this._map.hasLayer(baseLayer)) {
            this._map.addLayer(baseLayer);
        }
        if(!this._layers[L.stamp(baseLayer)]) {
            this.addBaseLayer(baseLayer);
        }

        for(var id in this._layers) {
            var obj = this._layers[id];
            if(obj.overlay) {
                if(mapLayers.overLayers[obj.name] && !this._map.hasLayer(obj.layer)) {
                    this._map.addLayer(obj.layer);
                }else if(!mapLayers.overLayers[obj.name]) {
                    if(this._map.hasLayer(obj.layer)) {
                        this._map.removeLayer(obj.layer);
                    }
                    this.removeLayer(obj.layer);
                }
            }else {
                if(mapLayers.baseLayer !== obj.layer && this._map.hasLayer(obj.layer)) {
                    this._map.removeLayer(obj.layer);
                }
            }
        }

        var overLayer;
        for(name in mapLayers.overLayers) {
            overLayer = mapLayers.overLayers[name];
            if(!this._layers[L.stamp(overLayer)]) {
                if(!this._map.hasLayer(overLayer)) {
                    this._map.addLayer(overLayer);
                }
                this.addOverlay(overLayer, name);
            }
        }
    }
});

L.control.layersManager = function( baseLayers, overLayers, options ) {
    var newControl = new L.Control.LayersManager( baseLayers, overLayers, options );
    return newControl;
};
})();