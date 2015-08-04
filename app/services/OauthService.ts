/**
 * Created by tiwen.wang on 7/28/2015.
 */
import {Injectable, Inject, URLSearchParams, Http, httpInjectables} from 'angular2/angular2';

@Injectable()
export class OauthService {
    accessTokenName: string;
    appUser: string;
    token: {
        access_token: string
    };
    constructor() {
        this.accessTokenName = "accessToken";
        this.appUser = "mdmap-storage-user";
    }

    oauthUser(user) {
        console.log(user);
        var accessTokenName = this.accessTokenName;
        var params = new URLSearchParams('');
        params.append('grant_type', 'password');
        params.append('client_id', 'my-trusted-client');
        params.append('username', user.username);
        params.append('password', user.password);

        return new Promise((resolve, reject) => {

            fetch('http://www.photoshows.cn/oauth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            }).then((response) => {
                if(response.status !== 200) {
                    reject({message: response.statusText});
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
                            localStorage.setItem(accessTokenName, JSON.stringify(token));

                            resolve();
                        }
                    );
                }

            }).catch((error) => {
                reject(error);
            });
        });
    }

    getAuthorization(): string {
        var accessToken = "";
        if(this.token) {
            accessToken =  this.token.access_token;
        }else {
            this.token = JSON.parse(localStorage.getItem(this.accessTokenName));
            if(this.token) {
                accessToken =  this.token.access_token;
            }
        }

        if(accessToken) {
            return 'Bearer ' + accessToken;
        }else {
            return '';
        }
    }

    logout() {
        localStorage.removeItem(this.accessTokenName);
        localStorage.removeItem(this.appUser);
        delete this.token;
    }
}