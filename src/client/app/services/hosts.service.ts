import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
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

	addService(hostBody){
		let body = hostBody;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

		return this._http.post('/api/services', body, options)
			.map(this.extractData)
			.catch(this.handleError);
	}

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

	private extractData(res: Response) {
	  let body = res.json();
	  return body.data || { };
	}
	private handleError(error: Response) {
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
}
