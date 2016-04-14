import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MonitorService, Service} from '../../services/services';
import {ServiceListComponent} from '../service-list/service-list.component';

@Component({
	selector: 'sauron-app',
	templateUrl: './app/components/app/app.component.html',
	directives: [
		ROUTER_DIRECTIVES,
		ServiceListComponent 
	],
	providers: [
		ROUTER_PROVIDERS,
		MonitorService
	]
})

export class AppComponent {
	title = 'Sauron';
}