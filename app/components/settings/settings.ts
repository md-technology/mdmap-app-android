import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    ElementRef,
    Inject,
    httpInjectables,
    bootstrap, bind, NgFor, NgIf} from 'angular2/angular2';

@Component({
    selector: 'settings-page',
    viewBindings: []
})
@View({
    templateUrl: 'components/settings/settings.html',
    directives: [ NgIf, NgFor ]
})
export class Settings {
    elementRef:ElementRef;

    constructor(elementRef:ElementRef) {
        this.elementRef = elementRef;
    }

    moreAction() {
        console.log('settings moreAction tap');
    }
}