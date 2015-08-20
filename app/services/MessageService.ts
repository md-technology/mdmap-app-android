import {Injectable, EventEmitter} from 'angular2/angular2';

@Injectable()
export class MessageService {
    login:EventEmitter = new EventEmitter();
    logout:EventEmitter = new EventEmitter();
    error:EventEmitter = new EventEmitter();
    success:EventEmitter = new EventEmitter();
    info:EventEmitter = new EventEmitter();
    photo:EventEmitter = new EventEmitter();
    constructor() {
    }

}