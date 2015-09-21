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
    constructor(elementRef: ElementRef, @Inject(MessageService) message) {
        this.elementRef = elementRef;
        this.message = message;
    }

    onFab() {
        console.log('fab clicked');
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