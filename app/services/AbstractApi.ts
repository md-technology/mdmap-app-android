import {Injectable, Inject, EventEmitter} from 'angular2/angular2';
import {Http, Headers, RequestOptions, Request, URLSearchParams} from 'angular2/http';
import {ObservableWrapper, PromiseWrapper} from 'angular2/src/core/facade/async';
import {OauthService} from './OauthService';

export class AbstractApi {
    baseUrl:string;
    http:Http;
    baseRequestOptions:RequestOptions;
    oauthService:OauthService;

    constructor(http:Http, baseRequestOptions:RequestOptions, oauthService:OauthService, serv:string) {
        this.http = http;
        this.baseRequestOptions = baseRequestOptions;
        this.oauthService = oauthService;
        this.baseUrl = "http://www.photoshows.cn/api/rest/" + serv;
    }

    one(id) {
        var resEmitter = new EventEmitter();
        var url = this.baseUrl;
        if (id) {
            url = url + '/' + id;
        }
        this.sendRequest(url, resEmitter);
        return resEmitter.toRx();
    }

    all(params) {
        var resEmitter = new EventEmitter();
        var url = this.baseUrl;
        if (params) {
            url = url + '?' + this.getURLSearchParams(params).toString();
        }
        this.sendRequest(url, resEmitter);
        return resEmitter.toRx();
    }

    oneAll(id, name, params = null) {
        var resEmitter = new EventEmitter();
        var url = this.baseUrl;
        url = url + '/' + id + '/' + name;
        if (params) {
            url = url + '?' + this.getURLSearchParams(params).toString();
        }
        this.sendRequest(url, resEmitter);
        return resEmitter.toRx();
    }

    sendRequest(url, resEmitter, refresh = false) {
        PromiseWrapper.then(window.fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': this.oauthService.getAuthorization()
            }
        }), res => {
            if(res.ok) {
                PromiseWrapper.then(res.json(), body => resEmitter.next(body));
            }else if(res.status === 401) {
                console.log(res.statusText);
                res.json().then((body) => {
                    console.log(body);
                    if(body && body.error == 'invalid_token') {
                        if(!refresh) {
                            PromiseWrapper.then(this.oauthService.refreshToken(),
                                () => this.sendRequest(url, resEmitter, true),
                                err => resEmitter.throw(err));
                        }
                    }else {
                        resEmitter.throw(body);
                    }
                });
            }else {
                resEmitter.throw(res);
            }
        }, (err) => {
            console.log(err);
            resEmitter.throw(err);
        });

    }

    //sendRequest(url) {
    //    var options = this.baseRequestOptions.merge({url: url+'k',
    //        headers: new Headers({
    //            'Accept': 'application/json',
    //            'Authorization': this.oauthService.getAuthorization()
    //        })});
    //    var request = new Request(options);
    //    return this.http.request(request)
    //        //Get the RxJS Subject
    //        .toRx()
    //        .catch(res => {
    //            console.log(res.json());
    //        })
    //        // Call map on the response observable to get the parsed people object
    //        .map(res => res.json());
    //}

    getURLSearchParams(params) {
        var urlSearchParams = new URLSearchParams('1=1');
        for (var name in params) {
            if (name) {
                urlSearchParams.append(name, params[name]);
            }
        }
        return urlSearchParams;
    }
}