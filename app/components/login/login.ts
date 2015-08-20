/**
 * Created by tiwen.wang on 7/24/2015.
 */
import {ComponentAnnotation as Component,
    ViewAnnotation as View,
    Inject,
    EventEmitter,
    NgFor, NgIf} from 'angular2/angular2';
import { Router } from 'angular2/router';
import { OauthService } from 'services/OauthService';
import { UserApi } from 'services/Apis';
import { MessageService } from 'services/MessageService';

@Component({
    selector: 'login',
    viewBindings: [OauthService, UserApi]
})
@View({
    templateUrl: 'components/login/login.html'
})
export class Login {
    router: Router;
    oauth: OauthService;
    userApi:UserApi;
    loading: boolean;
    message:MessageService;
    constructor( router: Router, @Inject(OauthService) oauth, @Inject(MessageService) message, @Inject(UserApi) userApi:UserApi ) {
        this.router = router;
        this.oauth = oauth;
        this.message = message;
        this.userApi = userApi;
    }

    login(event, username, password) {
        // This will be called when the user clicks on the Login button
        event.preventDefault();
        this.loading = true;
        this.oauth.oauthUser({username: username, password: password})
            .then(() => {
                this.loading = false;
                this.userApi.me()
                    // Subscribe to the observable to get the parsed people object and attach it to the
                    // component
                    .subscribe(user => this.message.login.next(user));
                this.router.parent.navigate('/');
        }).catch((error) => {
                this.loading = false;
                this.message.error.next(error.message);
            });
    }

    goSignup() {
        this.router.parent.navigate('/signup');
    }
}
