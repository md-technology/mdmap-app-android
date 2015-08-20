/**
 * Created by tiwen.wang on 4/21/2015.
 */
(function(f) {
    f();
    System.register("components/maps/leaflet-panoramio/leaflet.IconsLayer", [], function($__export) {
        "use strict";
        var __moduleName = "components/maps/leaflet-panoramio/leaflet.IconsLayer";
        return {
            setters: [],
            execute: function () {
                $__export("iconsLayer", L.iconsLayer);
            }
        };
    });
})(function() {
    L.IconsLayer = L.LayerGroup.extend({

        includes: L.Mixin.Events,

        initialize: function (options) {
            var self = this;
            self._opts = L.Util.extend({auto: true, clickable: true}, options);
            self._layers = {};
            self.markerIds = {};
            self._listeners = {
                viewreset: function(e) {
                    self._onMapChanged(e);
                },
                moveend: function(e) {
                    self._onMapChanged(e);
                }
            };
        },
        _layers: {},
        _opts: {},
        onAdd: function (map) {
            var self = this;
            self._map = map;

            map.on(self._listeners);

            for(var id in self.markerIds) {
                if(self._layers[id]) {
                    map.addLayer(self._layers[id]);
                }
            }
        },

        onRemove: function (map) {
            var self = this;
            self._opts.auto = false;
            for (var i in self._layers) {
                map.removeLayer(self._layers[i]);
            }
            map.off(self._listeners);
        },

        _onMapChanged: function (e) {
            var self = this;

            var bounds = self.getBounds(),
                level = self.getLevel(),
                size = self.getSize();

            // 地图为初始化完时 getBounds()为空
            if (!bounds.ne) {
                return;
            }

            self.fire('map_changed', [bounds, level, size]);

            var requestStamp = L.stamp(bounds);
            self._requestStamp = requestStamp;

            self.fire('loading');

            self._readData(bounds, level, size).then(function (photos) {
                if (requestStamp !== self._requestStamp) {
                    return;
                }
                self.fire('loaded');

                if (photos && L.Util.isArray(photos)) {

                    for(var id in self.markerIds) {
                        var exist = false;
                        for(var j in photos) {
                            if(photos[j].id == id) {
                                exist = true;
                                break;
                            }
                        }
                        if(!exist) {
                            self.hideLayer(id);
                        }
                    }

                    for(var i in photos) {
                        var exist = false;
                        for(var id in self.markerIds) {
                            if(photos[i].id == id) {
                                exist = true;
                                break;
                            }
                        }
                        if(!exist) {
                            self.markerIds[photos[i].id] = photos[i];
                            self.createMarker(photos[i]);
                        }
                    }

                    // trigger data_changed event
                    self.fire('data_changed', {photos: photos});
                }
            });
        },
        createMarker: function (photo) {
            var self = this;
            var marker = self._layers[photo.id];
            if (!marker) {
                var myIcon = L.divIcon({
                    className: 'icon-marker',
                    iconSize: L.point(40, 40),
                    html: '<img src="' + self.getIconUrl(photo.oss_key) + '">'
                });

                var markerStyle = {icon: myIcon, riseOnHover: true};
                markerStyle = L.Util.extend(markerStyle, self._opts.markerStyle);
                marker = L.marker([photo.location.position[1], photo.location.position[0]],
                    markerStyle);

                marker.photo = photo;
                self.addLayer(marker);

                if (self._opts.clickable) {
                    marker.on('click',
                        function (e) {
                            if (self._opts.suppressInfoWindows) {
                                infoWindow.setLatLng(this.getLatLng())
                                    .setContent(that.getInfoWindowContent(photo))
                                    .openOn(map);
                            } else {
                                self.fire('data_clicked', {originEvent: e,
                                    photo: this.photo});
                            }
                        });
                }
                //map.entities.push(label);
                self._layers[photo.id] = marker;

            }else {
                this._map.addLayer(marker);
            }

        },
        trigger: function() {
            var self = this;
            if(self._map) {
                self._map.fire('moveend');
            }
        },
        //staticCtx: "http://static.photoshows.cn",
        getIconUrl : function(photoOssKey) {
            return this._opts.staticCtx + '/' + photoOssKey + '@!panor-lg';
        },

        hideLayer: function (photoId) {
            var layer = this._layers[photoId];
            if (layer) {
                this.removeLayer(layer);
                delete this._layers[photoId];
            }
            delete this.markerIds[photoId];
        },
        _readData: function () {
            return {
                then: function () {
                }
            };
        },

        setReadData: function (readData) {
            this._readData = readData;
            return this;
        },
        getBounds: function () {
            var bounds = this._map.getBounds();
            if (bounds) {
                return {
                    ne: bounds.getNorthEast(),
                    sw: bounds.getSouthWest()
                };
            } else {
                return {};
            }
        },

        getLevel: function () {
            if(!!this._map) {
                var zoom = this._map.getZoom();
                return parseInt(zoom, 0);
            }else {
                return 0;
            }
        },

        getSize: function () {
            return {
                width: this._map.getSize().x,
                height: this._map.getSize().y
            };
        }
    });

    L.iconsLayer = function (options) {
        return new L.IconsLayer(options);
    };
});

