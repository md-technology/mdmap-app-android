/**
 * Created by tiwen.wang on 8/11/2015.
 */
import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    ElementRef,
    Inject,
    Ancestor,
    NgFor, NgIf} from 'angular2/angular2';
import {
    RouterLink,
    RouteParams
} from 'angular2/router';
import {ObservableWrapper, PromiseWrapper} from 'angular2/src/facade/async';
import { App } from '../app/app';
import { UserApi, AlbumApi } from 'services/Apis';
import { MessageService } from 'services/MessageService';

@Component({
    selector: 'album',
    viewBindings: [ UserApi, AlbumApi ]
})
@View({
    templateUrl: 'components/album/album.html',
    directives: [ NgIf, NgFor, RouterLink ]
})
export class Album {
    elementRef:ElementRef;
    albumApi:AlbumApi;
    album: Object;
    message: MessageService;
    constructor(elementRef:ElementRef, params: RouteParams, @Inject(AlbumApi) albumApi:AlbumApi, @Inject(MessageService) message) {
        this.elementRef = elementRef;
        this.albumApi = albumApi;
        this.message = message;

        var id = params.get('id');
        this.album = {id: id};

        this.albumApi.album(id)
            .catch(err => {console.log(err); return err;})
            .subscribe(album => {
                this.album = album;
                for(var photo of this.album.photos) {
                    photo.ossKey = 'http://static.photoshows.cn/'+photo.oss_key+'@!panor-lg';
                }
            });
    }

    /**
     * 响应图片点击事件,打开图片详情页面
     * @param e
     */
    onPhotoClick(e) {
        this.message.photo.next(e.detail);
    }

    onFab(e) {

    }
}