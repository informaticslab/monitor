import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class Report {
	constructor(
		public service: JSON,
		public report: JSON
	) {}
}

@Injectable()
export class ReportService {
	constructor(private _http: Http) {}

	getReports(){
		return this._http.get('/api/report/services')
			// .map((response: Response) => <Report[]>response.json())
			.map(this.extractData)
			// .do(Response => console.log(Response))
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		let body = res.json();
		console.log(body);
		return <Report[]>body || [];
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}