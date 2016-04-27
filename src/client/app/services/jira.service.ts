import {Injectable} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class JiraResults {
	constructor(
		public report: JSON
	) { }
}

@Injectable()
export class JiraService {
	constructor(private _http: Http){}

	getSDIssues(){
		let query = 'http://jira.phiresearchlab.org/rest/api/2/search?jql=project=IIUSD';
		let headers = new Headers({
			'Access-Control-Allow-Origin': 'http://localhost:3000'});
		let options = new RequestOptions({ headers: headers });
		return this._http.get(query, options)
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