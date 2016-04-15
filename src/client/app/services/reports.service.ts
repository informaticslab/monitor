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
			.map((response: Response) => <Report[]>response.json())
			.do(Response => console.log(Response))
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}