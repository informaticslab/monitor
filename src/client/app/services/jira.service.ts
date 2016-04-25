import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
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

	}
}