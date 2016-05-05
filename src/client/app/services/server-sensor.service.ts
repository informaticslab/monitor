import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class SensorData {
	constructor(
		public id: number,
		public name: string,
		public connected: boolean,
		public data: JSON
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
			throw new Error('Bad response status: ' + res.status);
		}
		var body = res.json();
		console.log(body);
		return body || {};
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}