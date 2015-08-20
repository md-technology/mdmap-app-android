import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    ElementRef,
    Inject,
    httpInjectables,
    bootstrap, bind, NgFor, NgIf} from 'angular2/angular2';
import { routerInjectables, LocationStrategy, HashLocationStrategy, RouteConfig, Redirect, RouterOutlet, RouterLink } from 'angular2/router';
import { Login } from 'components/login/login';
import { Signup } from 'components/signup/signup';
import { Groups, Group, UserPage } from 'components/group/groups';
import { Maps } from 'components/maps/maps';
import { Album } from 'components/album/album';
import { PhotoPage } from 'components/photo-page/photo-page';
import { OauthService } from 'services/OauthService';
import { Settings } from 'components/settings/settings';
import { User } from '../../services/Apis';
import { MessageService } from 'services/MessageService';

@RouteConfig([
    { path: '/login', component: Login, as: 'login'},
    { path: '/signup', component: Signup, as: 'signup'},
    { path: '/', component: Maps, as: 'maps'},
    { path: '/user-page', component: UserPage, as: 'userPage'},
    { path: '/group/:id', component: Group, as: 'group'},
    { path: '/album/:id', component: Album, as: 'album'},
    { path: '/settings', component: Settings, as: 'settings'}
])
@Redirect({path: '', redirectTo: '/maps'})
@Component({
    selector: 'hello',
    viewBindings: [OauthService, httpInjectables]
})
@View({
    templateUrl: 'components/app/app.html',
    directives: [ NgIf, NgFor, RouterOutlet, RouterLink, Login, Signup, PhotoPage ]
})
export class App {
    elementRef: ElementRef;
    oauth: OauthService;
    message: MessageService;
    messageText:string;
    _user: User;
    photoId: string;
    photoOpen: boolean;
    appCache:AppCache;
    constructor(elementRef: ElementRef, @Inject(OauthService) oauth, @Inject(MessageService) message,
                @Inject(AppCache) appCache ) {
        this.elementRef = elementRef;
        this.oauth = oauth;
        this.appCache = appCache;
        var el = this.elementRef.nativeElement;
        var dp = el.querySelector("#drawerPanel");
        dp.addEventListener('paper-responsive-change', () => {
            console.log("paper-responsive-change");
            var mt = el.querySelector("#message-toast");
            this.messageText = "paper-responsive-change";
            mt.show();
        });

        var user = localStorage.getItem("mdmap-storage-user");
        if(user && user != "undefined") {
            this.user = JSON.parse(user);
        }

        this.message = message;
        this.message.login.toRx().subscribe((user) => {
            this.appCache.user = user;
            this.user = user;
            this.message.success.next('登录成功');
        });
        this.message.logout.toRx().subscribe(() => this.message.success.next('已退出'));

        this.message.success.toRx().subscribe(text=>this.showMessage(text));
        this.message.error.toRx().subscribe(text=>this.showMessage(text));
        this.message.photo.toRx().subscribe(photo=>this.showPhoto(photo));
    }

    toggleDrawer() {
        var el = this.elementRef.nativeElement;
        var dp = el.querySelector("#drawerPanel");
        dp.closeDrawer();
    }

    logout() {
        this.oauth.logout();
        this.user = null;
    }

    showMessage(message) {
        var el = this.elementRef.nativeElement;
        var mt = el.querySelector("#message-toast");
        this.messageText = message;
        mt.show();
    }

    showPhoto(photo) {
        console.log('[app] photo open');
        this.photoId = photo.id;
        this.photoOpen = true;
    }

    set user(user) {
        this._user = user;
        this.appCache.user = user;
    }

    get user() {
        return this._user;
    }
}

export class AppCache {
    _user:User;
    constructor() {}

    set user(user) {
        this._user = user;
    }

    get user() {
        return this._user;
    }
}

bootstrap(App, [routerInjectables, MessageService, AppCache, bind(LocationStrategy).toClass(HashLocationStrategy)]);
