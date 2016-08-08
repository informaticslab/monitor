import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

export class SensorData {
	constructor(
		public errors: number,
		public isValid: boolean,
		public temperature: number,
		public humidity: number
	){}
}

@Injectable()
export class ServerSensorService {
	constructor(private _http: Http) {}

	getSensorData(){
		let path = '/api/sensor/data'   //TODO: Refactor into a config file

		return this._http.get(path)
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			console.log(res);
			throw new Error('Bad response status: ' + res.status);
		}
		var body = res.json();
		return body || {};
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}