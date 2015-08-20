/**
 * Created by tiwen.wang on 8/14/2015.
 */
(function() {

    var L = window.L || {};

    L.PhotoMarker = {};

    L.PhotoMarker.Icon = L.DivIcon.extend({
        options: {
            element: null // a initialized DOM element
            //same options as divIcon except for html
        },

        createIcon: function() {
            if(!this.options.element) {
                return;
            }

            var div = this.options.element;
            this._setIconStyles(div, 'icon');
            return div;
        }
    });

    L.PhotoMarker.icon = function(options) {
        return new L.PhotoMarker.Icon(options);
    };

    L.photoMarker = function(photo, element) {
        if(photo.location) {
            return L.marker(L.latLng(photo.location.position[1], photo.location.position[0]),
                {icon: L.PhotoMarker.icon({
                    element: element
                })});
        }else {
            return null;
        }
    };

})();