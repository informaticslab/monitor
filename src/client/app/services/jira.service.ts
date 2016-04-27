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
		let url = 'http://jiradev.phiresearchlab.org/rest/api/latest/issue/IIUSD-67';
		// let headers = new Headers({
		// 	'Authorization': 'Basic dGFtaTpPdmVyd2F0Y2guMQ=='
		// });
		let headers = new Headers();
		headers.append('Authorization', 'Basic dGFtaTpPdmVyd2F0Y2guMQ==');
		// let options = new RequestOptions({ headers: headers });
		return this._http.get(url, {headers:headers})
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