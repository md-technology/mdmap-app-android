import {Component,
    View,
    ElementRef,
    Inject,
    httpInjectables,
    bootstrap, bind, NgFor, NgIf} from 'angular2/angular2';

import { MapApi } from 'services/Apis';
import { AppCache } from '../app/app';

@Component({
    selector: 'settings-page',
    viewBindings: [MapApi]
})
@View({
    templateUrl: 'components/settings/settings.html',
    directives: [ NgIf, NgFor ]
})
export class Settings {
    elementRef:ElementRef;
    mapApi:MapApi;
    maps:Array<Object>;
    appCache:AppCache;
    ready:boolean = false;
    constructor(elementRef:ElementRef, @Inject(MapApi)mapApi, @Inject(AppCache) appCache) {
        this.elementRef = elementRef;
        this.mapApi = mapApi;
        this.appCache = appCache;
        this.refresh();

        //this.addSelectListners();
    }

    refresh() {
        this.mapApi.getAll()
            .catch(err => {console.log(err); return err;})
            .subscribe(maps => {
                this.maps = maps;
                this.ready = true;
            });
    }

    //addSelectListners() {
    //    var el = this.elementRef.nativeElement;
    //    var dp = el.querySelector("#mapSelector");
    //    dp.addEventListener('selected-item-changed', (e) => {
    //        console.info(e.detail.value.map);
    //        this.appCache.mainMap = e.detail.value.map;
    //    });
    //}

    onSelected(e) {
        this.appCache.mainMap = e.detail;
    }

    moreAction() {
        console.log('settings moreAction tap');
    }
}