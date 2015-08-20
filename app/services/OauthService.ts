/**
 * Created by tiwen.wang on 7/28/2015.
 */
import {Injectable, Inject, URLSearchParams, Http, httpInjectables} from 'angular2/angular2';
import {ObservableWrapper, PromiseWrapper} from 'angular2/src/facade/async';

@Injectable()
export class OauthService {
    accessTokenName: string;
    appUser: string;
    url:string;
    _token: Object;
    constructor() {
        this.accessTokenName = 'accessToken';
        this.appUser = 'mdmap-storage-user';
        this.url = 'http://www.photoshows.cn/oauth/token';
    }

    oauthUser(user) {
        var completer = PromiseWrapper.completer();

        var params = new URLSearchParams('');
        params.append('grant_type', 'password');
        params.append('client_id', 'my-trusted-client');
        params.append('username', user.username);
        params.append('password', user.password);

        PromiseWrapper.then(fetch(this.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        }), (response) => {
            this.responseToken(response, completer);
        }, (err) => {
            completer.reject(err);
        });
        return completer.promise;
    }

    refreshToken() {
        var completer = PromiseWrapper.completer();

        if(!this.token) {
            completer.reject('no refresh token');
            return completer.promise;
        }
        var params = new URLSearchParams('');
        params.append('grant_type', 'refresh_token');
        params.append('client_id', 'my-trusted-client');
        params.append('refresh_token', this.token.refresh_token);

        PromiseWrapper.then(fetch(this.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            }), (response) => {
                this.responseToken(response, completer);
            }, (err) => {
                completer.reject(err);
            });
        return completer.promise;
    }

    responseToken(response, completer) {
        if(response.status !== 200) {
            completer.reject({message: response.statusText});
        }else {
            response.json(response).then(
                (token) => {
                    if (token.expires_in) {
                        var hours = Math.floor(token.expires_in / 60 / 60);
                        var currentDate = new Date();
                        currentDate.setHours(currentDate.getHours() + hours);
                        token.expires_time = currentDate;
                    }
                    this.token = token;
                    completer.resolve();
                }
            );
        }
    }

    getAuthorization(): string {
        if(this.token) {
            return 'Bearer ' + this.token.access_token;
        }
        return '';
    }

    set token(token) {
        this._token = token;
        localStorage.setItem(this.accessTokenName, JSON.stringify(this._token));
    }

    get token() {
        if(!this._token) {
            this._token = JSON.parse(localStorage.getItem(this.accessTokenName));
        }
        return this._token;
    }

    logout() {
        localStorage.removeItem(this.accessTokenName);
        localStorage.removeItem(this.appUser);
        delete this.token;
    }
}