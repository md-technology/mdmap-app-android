/**
 * Created by tiwen.wang on 8/4/2015.
 */
import {ComponentAnnotation as Component, ViewAnnotation as View,
    ElementRef,
    EventEmitter,
    Inject,
    NgFor, NgIf} from 'angular2/angular2';
import { PhotoApi } from 'services/Apis';

@Component({
    selector: 'photo-page',
    properties: ['photoId', 'open'],
    events: ['openChanged: open'],
    viewBindings: [ PhotoApi ],
})
@View({
    templateUrl: 'components/photo-page/photo-page.html',
    directives: [ NgIf ]
})
export class PhotoPage {
    elementRef: ElementRef;
    id: string;
    photo: {id: string};
    _open: boolean;
    openChanged = new EventEmitter();
    photoLoading: boolean;
    photoApi: PhotoApi;
    constructor(elementRef: ElementRef, @Inject(PhotoApi) photoApi) {
        this.elementRef = elementRef;
        this.photoApi = photoApi;
    }

    set photoId(id) {
        this.id = id;
    }
    get photoId() {
        return this.id;
    }

    set open(open) {
        this._open = open;
        if(this._open && this.id) {
            delete this.photo;
            var el = this.elementRef.nativeElement;
            var pd = el.querySelector("#photoDialog");
            pd.open();
            this.getPhoto(this.id);
        }
    }

    get open() {
        return this._open;
    }

    onPhotoDialogClosed() {
        this._open = false;
        this.openChanged.next(false);
    }

    getPhoto(id) {
        this.photoLoading = true;
        this.photoApi.getPhoto(id).subscribe((photo) => {
                this.photoLoading = false;
                photo.ossKey = photo.oss_key;
                this.photo = photo;
            },
            (err) => {this.photoLoading = false;}
        );
    }

}