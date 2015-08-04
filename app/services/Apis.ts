/**
 * Created by tiwen.wang on 7/28/2015.
 */

import {Injectable, Inject} from 'angular2/angular2';
import {Http, RequestOptions, Request} from 'angular2/http';
import {AbstractApi} from './AbstractApi';
import {OauthService} from './OauthService';

export class Cover {
    oss_key:string;
}

export class User {
    name:string;
    email:string;
    avatar:Cover;
    profileCover:Cover;
}

@Injectable()
export class UserApi extends AbstractApi {

    constructor(@Inject(Http) http: Http, @Inject(RequestOptions) baseRequestOptions:RequestOptions, @Inject(OauthService) oauthService:OauthService) {
        super(http, baseRequestOptions, oauthService, 'user');
    }

    me() {
        return super.one('');
    }
}


@Injectable()
export class PanoramioApi extends AbstractApi {
    constructor(@Inject(Http) http: Http, @Inject(RequestOptions) baseRequestOptions:RequestOptions, @Inject(OauthService) oauthService:OauthService) {
        super(http, baseRequestOptions, oauthService, 'panoramio');
    }

    getList(params) {
        return super.all(params);
    }
}