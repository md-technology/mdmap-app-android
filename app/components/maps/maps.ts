/**
 * Created by tiwen.wang on 7/26/2015.
 */
import {ComponentAnnotation as Component,
        ViewAnnotation as View,
        ElementRef,
        NgFor, NgIf} from 'angular2/angular2';
import { LeafletPanoramio } from './leaflet-panoramio/leaflet-panoramio';

@Component({
    selector: 'maps'
})
@View({
    templateUrl: 'components/maps/maps.html',
    directives: [ LeafletPanoramio ]
})
export class Maps {
    elementRef: ElementRef;
    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    onFab() {
        var el = this.elementRef.nativeElement;
        var lp = el.querySelector("leaflet-panoramio");
        lp.showContainer();
    }
}