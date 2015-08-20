// This is a list of example API codes, to make this preview
// functioning. Please register with the providers to use them
// with your own app.
(function() {

	var L = window.L || {};

	var exampleAPIcodes = {
		'HERE': {
			'app_id': 'Y8m9dK2brESDPGJPdrvs',
			'app_code': 'dq2MYIvjAotR8tHvY8Q_Dg'
		},
		'MapBox': {
			token: 'pk.eyJ1IjoiYW55cG9zc2libGUiLCJhIjoiaTdwSGNWVSJ9.BoT7DTs0JTTAQ15v7-wkKg',
			Penil: 'anypossible.l3d50cm5',
			Satellite: 'anypossible.m5n45i9h',
			SatelliteStreets: 'anypossible.m5n4g7e0',
			Light: 'anypossible.m5n4df89',
			DaithStar: 'examples.3hqcl3di',
			MarsSatellite: 'mapbox.mars-satellite',
			Dark: 'anypossible.mb7nb4do',
			Streets: 'anypossible.mb7ojm5k',
			Outdoors: 'anypossible.mb7p2034',
			Hike: 'anypossible.mb7p5k3m',
			Pirate: 'anypossible.mb7p8g4g',
			Tornado: 'anypossible.mc1hm5il'
		}
	};

	var origProviderInit = L.TileLayer.Provider.prototype.initialize;
	L.TileLayer.Provider.include({
		initialize: function (providerName, options) {
			this._providerName = providerName;
			options = options || {};

			// replace example API codes in options
			if (this._providerName.split('.')[0] === 'MapBox') {
				providerName = ['MapBox', exampleAPIcodes.MapBox[this._providerName.split('.')[1]]].join('.');
				L.extend(options, {token: exampleAPIcodes.MapBox.token});
				//this._exampleUrl = L.TileLayer.Provider.providers.MapBox.url('MapBox.\' + your_api_code + \'');
			} else {
				var provider = this._providerName.split('.')[0];
				if (provider in exampleAPIcodes) {
					L.extend(options, exampleAPIcodes[provider]);
				}
			}
			origProviderInit.call(this, providerName, options);
		}
	});

// save the options while creating tilelayers to cleanly access them later.
	var origTileLayerInit = L.TileLayer.prototype.initialize;
	L.TileLayer.include({
		initialize: function (url, options) {
			this._options = options;
			origTileLayerInit.apply(this, arguments);
		}
	});

	L.tileLayer.provider.eachLayer = function (callback) {
		for (var provider in L.TileLayer.Provider.providers) {
			if (L.TileLayer.Provider.providers[provider].variants) {
				for (var variant in L.TileLayer.Provider.providers[provider].variants) {
					callback(provider + '.' + variant);
				}
			} else {
				callback(provider);
			}
		}
	};

})();