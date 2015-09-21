/**
 * Created by tiwen.wang on 8/3/2015.
 */
import {Component,
    View,
    Inject,
    EventEmitter,
    NgFor, NgIf} from 'angular2/angular2';
import { iconsLayer } from './leaflet.IconsLayer';
import { PanoramioApi } from 'services/Apis';

@Component({
    selector: 'leaflet-panoramio',
    properties:['container'],
    viewBindings: [ PanoramioApi ],
    events: ['photoClick']
})
@View({
    //template: ''
    templateUrl: 'components/maps/leaflet-panoramio/leaflet-panoramio.html'
})
export class LeafletPanoramio {
    _container: {invalidateSize: Function};
    panoramioApi: PanoramioApi;
    photoClick = new EventEmitter();
    constructor(@Inject(PanoramioApi) panoramioApi) {
        this.panoramioApi = panoramioApi;
    }

    set container(container) {
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
                }).on('data_clicked', evt => {
                    this.photoClick.next(evt.photo);
                })
                    //.on('data_changed', evt => this.container.invalidateSize(false))
                    .addTo(this._container);

            setTimeout(() => {
                this.container.invalidateSize(false);
            }, 500);
        }
    }

    get container() {
        return this._container;
    }
}