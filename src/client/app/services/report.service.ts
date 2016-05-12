import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
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
			.map(this.extractData)
			.catch(this.handleError);
	}

	private extractData(res: Response) {
		if (res.status < 200 || res.status >= 300) {
			throw new Error('Bad response status: ' + res.status);
		}
		var body = res.json();
		body = <Report[]>body;
		var newBody = [];

		//get all down status
		for (let i = 0; i < body.length; i++) {
			if(body[i].status.currentOutage.currentOutage !== null) {
				newBody.push(body[i]);
			}
		}
		for (let i = 0; i < body.length; i++) {
			if(body[i].status.currentOutage.currentOutage === null) {
				newBody.push(body[i]);
			}
		}

		// console.log(newBody);
		return newBody || [];
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}