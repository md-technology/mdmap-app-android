/**
 * Created by tiwen.wang on 7/24/2015.
 */
import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    Inject,
    Ancestor,
    NgFor, NgIf} from 'angular2/angular2';
import { Router } from 'angular2/router';
import { OauthService } from 'services/OauthService';
import { UserApi } from 'services/Apis';
import { App } from '../app/app';

@Component({
    selector: 'login',
    viewInjector: [OauthService, UserApi]
})
@View({
    templateUrl: 'components/login/login.html'
})
export class Login {
    router: Router;
    oauth: OauthService;
    userApi:UserApi;
    app: App;
    loading: boolean;
    constructor(@Ancestor() app:App, router: Router, @Inject(OauthService) oauth, @Inject(UserApi) userApi:UserApi ) {
        this.router = router;
        this.oauth = oauth;
        this.app = app;
        this.userApi = userApi;
    }

    login(event, username, password) {
        // This will be called when the user clicks on the Login button
        event.preventDefault();

        console.log("user login with '" + username + "'");

        this.loading = true;
        this.oauth.oauthUser({username: username, password: password})
            .then((response) => {
                this.loading = false;
                this.app.showMessage("登录成功");
                this.userApi.me()
                    // Subscribe to the observable to get the parsed people object and attach it to the
                    // component
                    .subscribe(user => {
                        if(user.avatar) {
                            user.avatar.ossKey = user.avatar.oss_key;
                        }
                        if(user.profileCover) {
                            user.profileCover.ossKey = user.profileCover.oss_key;
                        }
                        this.app.user = user;
                    });

                this.router.parent.navigate('/maps');
        }).catch((error) => {
                this.loading = false;
                this.app.showMessage(error.message);
            });
    }

    goSignup() {
        this.router.parent.navigate('/signup');
    }
}
