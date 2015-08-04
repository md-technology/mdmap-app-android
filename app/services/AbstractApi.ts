/**
 * Created by tiwen.wang on 7/28/2015.
 */

import {Injectable, Inject} from 'angular2/angular2';
import {Http, Headers, RequestOptions, Request, URLSearchParams} from 'angular2/http';
import {OauthService} from './OauthService';

@Injectable()
export class AbstractApi {
    baseUrl: string;
    http:Http;
    baseRequestOptions:RequestOptions;
    oauthService: OauthService;
    constructor(http:Http, baseRequestOptions:RequestOptions, oauthService:OauthService, serv:string) {
        this.http = http;
        this.baseRequestOptions = baseRequestOptions;
        this.oauthService = oauthService;
        this.baseUrl = "http://www.photoshows.cn/api/rest/"+serv;
    }


    fetch(api, params) {
        //fetch(this.baseUrl+'/'+api, {
        //    method: 'POST',
        //    headers: {
        //        'Accept': 'application/json',
        //        'Content-Type': "application/x-www-form-urlencoded",
        //        'Authorization': this.oauthService.getAuthorization()
        //    },
        //    body: params
        //}).then((response) => {
        //
        //});
    }

    one(id) {

        var url = this.baseUrl;
        if(id) {
            url = url + '/' + id;
        }
        var options = this.baseRequestOptions.merge({url: url,
            headers: new Headers({
                'Accept': 'application/json',
                'Authorization': this.oauthService.getAuthorization()
            })});
        var request = new Request(options);
        return this.http.request(request)
            //Get the RxJS Subject
            .toRx()
            // Call map on the response observable to get the parsed people object
            .map(res => res.json());
    }

    all(params) {
        var url = this.baseUrl;
        url = url + '?' + this.getURLSearchParams(params).toString();
        var options = this.baseRequestOptions.merge({url: url,
            headers: new Headers({
                'Accept': 'application/json',
                'Authorization': this.oauthService.getAuthorization()
            })});
        var request = new Request(options);
        return this.http.request(request)
            //Get the RxJS Subject
            .toRx()
            // Call map on the response observable to get the parsed people object
            .map(res => res.json());
    }

    getURLSearchParams(params) {
        var urlSearchParams = new URLSearchParams('1=1');
        for(var name in params) {
            if(name) {
                urlSearchParams.append(name, params[name]);
            }
        }
        return urlSearchParams;
    }
}