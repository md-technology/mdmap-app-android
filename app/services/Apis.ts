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
    id: string;
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

    ossKey(user) {
        if(user.avatar) {
            user.avatar.ossKey = 'http://static.photoshows.cn/'+user.avatar.oss_key;
        }
        if(user.profileCover) {
            user.profileCover.ossKey = 'http://static.photoshows.cn/'+user.profileCover.oss_key;
        }
        if(user.mastheadCover) {
            user.mastheadCover.ossKey = 'http://static.photoshows.cn/'+user.mastheadCover.oss_key;
        }
        return user;
    }

    me() {
        return super.one('').map(user=> this.ossKey(user));
    }

    user(id) {
        return super.one(id).map(user=> this.ossKey(user));
    }

    groups(id) {
        return super.oneAll(id, 'groups');
    }

    albums(id:string, pageNo:number, pageSize:number) {
        return super.oneAll(id, 'albums', {pageNo:pageNo, pageSize:pageSize});
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

@Injectable()
export class PhotoApi extends AbstractApi {
    constructor(@Inject(Http) http: Http, @Inject(RequestOptions) baseRequestOptions:RequestOptions, @Inject(OauthService) oauthService:OauthService) {
        super(http, baseRequestOptions, oauthService, 'photo');
    }

    getPhoto(id) {
        return super.one(id);
    }
}

@Injectable()
export class GroupApi extends AbstractApi {
    constructor(@Inject(Http) http: Http, @Inject(RequestOptions) baseRequestOptions:RequestOptions, @Inject(OauthService) oauthService:OauthService) {
        super(http, baseRequestOptions, oauthService, 'group');
    }

    getGroup(id) {
        return super.one(id);
    }
}

@Injectable()
export class AlbumApi extends AbstractApi {
    constructor(@Inject(Http) http: Http, @Inject(RequestOptions) baseRequestOptions:RequestOptions, @Inject(OauthService) oauthService:OauthService) {
        super(http, baseRequestOptions, oauthService, 'album');
    }

    album(id) {
        return super.one(id);
    }
}