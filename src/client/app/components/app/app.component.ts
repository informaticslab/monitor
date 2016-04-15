import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MonitorService, Service} from '../../services/hosts.service';
import {ReportService, Report} from '../../services/reports.service';
import {ServiceListComponent} from '../service-list/service-list.component';
import {ReportComponent} from '../reports/report.component';
import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
	selector: 'sauron-app',
	templateUrl: './app/components/app/app.component.html',
	directives: [
		ROUTER_DIRECTIVES,
		ServiceListComponent,
		ReportComponent 
	],
	providers: [
		ROUTER_PROVIDERS,
		HTTP_PROVIDERS,
		MonitorService,
		ReportService
	]
})

export class AppComponent {
	title = 'Sauron';
}