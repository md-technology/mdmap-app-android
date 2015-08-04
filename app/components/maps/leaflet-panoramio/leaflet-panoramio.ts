/**
 * Created by tiwen.wang on 8/3/2015.
 */
import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    Inject,
    NgFor, NgIf} from 'angular2/angular2';
import { iconsLayer } from './leaflet.IconsLayer';
import { PanoramioApi } from 'services/Apis';

@Component({
    selector: 'leaflet-panoramio',
    properties:['container'],
    viewInjector: [ PanoramioApi ]
})
@View({
    //template: ''
    templateUrl: 'components/maps/leaflet-panoramio/leaflet-panoramio.html'
})
export class LeafletPanoramio {
    _container: Object;
    panoramioApi: PanoramioApi;
    constructor(@Inject(PanoramioApi) panoramioApi) {
        this.panoramioApi = panoramioApi;
    }

    set container(container) {
        //console.log("set container");
        //console.log(container);
        if(container) {
            this._container = container;
            var markerLayer =
                iconsLayer({
                    auto: true,
                    staticCtx: 'http://static.photoshows.cn'
                }).setReadData((bounds, level, size) => {

                    return new Promise((resolve, reject) => {
                        this.panoramioApi.getList({
                                nelat: bounds.ne.lat,
                                nelng: bounds.ne.lng,
                                swlat: bounds.sw.lat,
                                swlng: bounds.sw.lng,
                                level: level,
                                width: size.width,
                                height: size.height,
                            })
                            .subscribe(photos => {
                                resolve(photos);
                                }, err => {
                                    reject(err);
                                });
                    });
                }).addTo(this._container);

            setTimeout(() => {
                this.container.invalidateSize(false);
            }, 500);
        }
    }

    get container() {
        return this._container;
    }
}