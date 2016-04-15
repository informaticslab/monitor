import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Rx';

export class Service {
	constructor(
		public name: string, 
		public interval: number,
		public failureInterval: number,
		public url: string,
		public port: number,
		public timeout: number,
		public warningThreshold: number,
		public id: string,
		public created: number
	) {}
}

@Injectable()
export class MonitorService {
	constructor(private _http: Http){}

	getServices(){
		return this._http.get('/api/services')
			.map((response: Response) => <Service[]>response.json())
			.do(Response => console.log(Response))
			.catch(this.handleError);
	}

	getServicesById(id){
		return this._http.get('/api/services/:id', id)
			.map((response: Response) => <Service[]>response.json())
			.do(Response => console.log(Response))
			.catch(this.handleError);
	}

	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
