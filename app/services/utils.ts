/**
 * Created by tiwen.wang on 7/28/2015.
 */
import {Injectable} from 'angular2/angular2';

@Injectable()
export class Utils {
    constructor() {
    }

    param(object) {
        var params = "";
        for(var name in object) {
            if(params) {
                params = params + "&" + name + "=" + object[name];
            }else {
                params = name + "=" + object[name];
            }
        }
        return params;
    }
}