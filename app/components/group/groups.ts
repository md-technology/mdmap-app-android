/**
 * Created by tiwen.wang on 8/6/2015.
 */
import {Component,
    View,
    ElementRef,
    Inject,
    Ancestor,
    NgFor, NgIf} from 'angular2/angular2';
import {
    RouterLink,
    RouteParams
} from 'angular2/router';
import {ObservableWrapper, PromiseWrapper} from 'angular2/src/core/facade/async';
import { AppCache } from '../app/app';
import { User, UserApi, GroupApi } from 'services/Apis';

@Component({
    selector: 'groups',
    properties: ['user'],
    viewBindings: [UserApi]
})
@View({
    templateUrl: 'components/group/groups.html',
    directives: [NgIf, NgFor, RouterLink]
})
export class Groups {
    elementRef:ElementRef;
    groups:Array;
    appCache:AppCache;
    userApi:UserApi;
    _user:User;

    constructor(elementRef:ElementRef, @Inject(UserApi) userApi:UserApi, @Inject(AppCache) appCache) {
        this.elementRef = elementRef;
        this.userApi = userApi;
        this.appCache = appCache;
    }

    set user(user) {
        this._user = user;
        this.groups = null;
        if (this._user && this._user.id) {
            this.userApi.groups(this._user.id)
                .subscribe((groups) => {
                    this.groups = groups;
                });
        }
    }

    get user() {
        return this._user;
    }

    refresh() {
        if (this._user && this._user.id) {
            this.userApi.groups(this._user.id)
                .subscribe((groups) => {
                    this.groups = groups;
                });
        }
    }

}

@Component({
    selector: 'group',
    viewBindings: [GroupApi, UserApi]
})
@View({
    templateUrl: 'components/group/group.html',
    directives: [NgIf, NgFor, RouterLink]
})
export class Group {
    elementRef:ElementRef;
    groupApi:GroupApi;
    userApi:UserApi;
    group:Object;
    albums:Array;
    ready:boolean;

    constructor(elementRef:ElementRef, params:RouteParams, @Inject(GroupApi) groupApi:GroupApi,
                @Inject(UserApi) userApi:UserApi) {
        this.elementRef = elementRef;
        this.groupApi = groupApi;
        this.userApi = userApi;
        var id = params.get('id');

        this.group = {id: id};
        this.refresh();
    }

    onMore(e) {
        console.log(e);
    }

    refresh() {
        this.groupApi.getGroup(this.group.id)
            .subscribe((group) => {
                if (group.mastheadCover) {
                    group.mastheadCover.ossKey = 'http://static.photoshows.cn/' + group.mastheadCover.oss_key;
                } else {
                    group.mastheadCover = {};
                }
                this.group = group;
                this.ready = true;
            });

        this.userApi.albums(this.group.id, 0, 10)
            .subscribe((albums) => {
                this.albums = albums;
            });
    }
}

@Component({
    selector: 'user-page',
    viewBindings: [UserApi]
})
@View({
    templateUrl: 'components/group/user.html',
    directives: [NgIf, NgFor, RouterLink, Groups]
})
export class UserPage {
    elementRef:ElementRef;
    userApi:UserApi;
    albums:Array;
    appCache:AppCache;
    user:User;
    ready:boolean;

    constructor(elementRef:ElementRef, params:RouteParams, @Inject(UserApi) userApi:UserApi, @Inject(AppCache) appCache) {
        this.elementRef = elementRef;
        this.userApi = userApi;
        this.appCache = appCache;
        var id = params.get('id');
        if (!id) {
            this.user = this.appCache.user;
            if (this.user) {
                this.ready = true;
                this.refresh();
            }
        } else {
            this.userApi.user(id).subscribe((user)=> {
                this.user = user;
                this.ready = true;
                this.refresh();
            });
        }
    }

    refresh() {
        this.userApi.albums(this.user.id, 0, 10)
            .subscribe((albums) => {
                this.albums = albums;
            });
    }
}