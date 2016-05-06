import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class JiraReservations {  //Maybe not needed
	constructor(
		public report: JSON
	) { }
}

@Injectable()
export class JiraService {
	constructor(private _http: Http){}

	getReservations(){
		return this._http.get('/api/jira/reservations')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getIssues() {
		return this._http.get('/api/jira/issues')
			.map(this.extractData)
			.catch(this.handleError);
	}

	getUnresolved() {
		return this._http.get('/api/jira/unresolved')
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		var body = res.json();
		// console.log(body);
		return body || {};
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
} 