/**
 * Created by tiwen.wang on 7/24/2015.
 */
import {Component,
    View, NgFor, NgIf} from 'angular2/angular2';

@Component({
    selector: 'signup',
    properties: ['user: user-name']
})
@View({
    template: `<div>
    <ng-content></ng-content>
    <div>username: <input #userinput [value]="user" (keyup)="onKeyup(userinput.value)"></div>
    <div>email: <input></div>
    <div>password: <input #password></div>
</div>`
})
export class Signup {
    constructor() {

    }

    onKeyup(user) {
        console.log(user);
    }
}
