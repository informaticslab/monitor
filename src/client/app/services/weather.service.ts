import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class WeatherReport {
	constructor(
		public report: JSON
	) {}
}

@Injectable()
export class WeatherService {
	constructor(private _http: Http) { }

	getCurrentConditions() {
		let query = 'http://api.wunderground.com/api/ce3119b0728c4a4c/conditions/q/GA/Atlanta.json'
		return this._http.get(query)
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