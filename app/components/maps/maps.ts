/**
 * Created by tiwen.wang on 7/26/2015.
 */
import {Component,
        View,
        ElementRef,
        Inject,
        NgFor, NgIf} from 'angular2/angular2';
import { LeafletPanoramio } from './leaflet-panoramio/leaflet-panoramio';
import { MessageService } from 'services/MessageService';
import { AppCache } from '../app/app';

@Component({
    selector: 'maps'
})
@View({
    templateUrl: 'components/maps/maps.html',
    directives: [ LeafletPanoramio ]
})
export class Maps {
    elementRef: ElementRef;
    message: MessageService;
    watch: boolean;
    map: Object;
    appCache:AppCache;
    constructor(elementRef: ElementRef, @Inject(MessageService) message, @Inject(AppCache) appCache) {
        this.elementRef = elementRef;
        this.message = message;
        this.appCache = appCache;
        this.map = this.appCache.mainMap || {
            "id": "26488265777198068635747901827",
            "name": "卫星地图",
            "baseLayer": "Esri.WorldImagery",
            "overLayers": {
                "道路": "MapQuestOpen.HybridOverlay"
            }
        };
        this.appCache.mainMapEmitter.toRx()
            .subscribe(map=>this.map = map);
    }

    onFab() {
        console.log('fab clicked');
        this.watch = !this.watch;
    }

    onPhotoClick(photo) {
        //console.log('[maps] photo clicked');
        this.message.photo.next(photo);
    }

    onMarkerClick(e) {
        console.log('[maps] test marker clicked');
        console.log(e);
    }

    onMapClicked(e, o) {
        console.log('[maps] test map clicked');
        console.log(e);
        console.log(o);
    }
}