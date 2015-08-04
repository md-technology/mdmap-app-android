import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    ElementRef,
    Inject,
    httpInjectables,
    bootstrap, bind, NgFor, NgIf} from 'angular2/angular2';
import { routerInjectables, LocationStrategy, HashLocationStrategy, RouteConfig, RouterOutlet, RouterLink } from 'angular2/router';
import { Login } from 'components/login/login';
import { Signup } from 'components/signup/signup';
import { Maps } from 'components/maps/maps';
import { OauthService } from 'services/OauthService';
import { User } from '../../services/Apis';

@RouteConfig([
    { path: '/login', component: Login, as: 'login'},
    { path: '/signup', component: Signup, as: 'signup'},
    { path: '/maps', component: Maps, as: 'maps'}
])
@Component({
    selector: 'hello',
    viewInjector: [OauthService, httpInjectables]
})
@View({
    templateUrl: 'components/app/app.html',
    directives: [NgIf, NgFor, RouterOutlet, RouterLink, Login, Signup]
})
export class App {
    elementRef: ElementRef;
    oauth: OauthService;
    message: string;
    user: User;
    gourps: Array;
    constructor(elementRef: ElementRef, @Inject(OauthService) oauth) {
        this.elementRef = elementRef;
        this.oauth = oauth;
        var el = this.elementRef.nativeElement;
        var dp = el.querySelector("#drawerPanel");
        dp.addEventListener('paper-responsive-change', () => {
            console.log("paper-responsive-change");
            var mt = el.querySelector("#message-toast");
            this.message = "paper-responsive-change";
            mt.show();
        });

        var user = localStorage.getItem("mdmap-storage-user");
        if(user && user != "undefined") {
            this.user = JSON.parse(user);
        }

        this.gourps = [{color:"red",name:"red"}, {color:"yellow",name:"yellow"}];
    }

    toggleDrawer() {
        var el = this.elementRef.nativeElement;
        var dp = el.querySelector("#drawerPanel");
        dp.closeDrawer();
    }

    logout() {
        this.oauth.logout();
        delete this.user;
    }

    showMessage(message) {
        var el = this.elementRef.nativeElement;
        var mt = el.querySelector("#message-toast");
        this.message = message;
        mt.show();
    }
}

bootstrap(App, [routerInjectables, bind(LocationStrategy).toClass(HashLocationStrategy)]);
