import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';
import {MonitorService, Service} from '../../services/hosts.service';
import {ReportService, Report} from '../../services/reports.service';
import {WeatherReport, WeatherService} from '../../services/weather.service';
// import {ServiceListComponent} from '../service-list/service-list.component';
// import {ReportComponent} from '../reports/report.component';
import {HomeComponent} from '../home/home.component';
import {LoginComponent} from '../login/login.component';
import {HTTP_PROVIDERS} from 'angular2/http';

@Component({
	selector: 'app',
	templateUrl: './app/components/app/app.component.html',
	directives: [
		ROUTER_DIRECTIVES,
		// ServiceListComponent,
		// ReportComponent 
	],
	providers: [
		ROUTER_PROVIDERS,
		HTTP_PROVIDERS,
		MonitorService,
		ReportService,
		WeatherService
	]
})

@RouteConfig([
	{path: '/login', component: LoginComponent, as: 'Login', useAsDefault:true},
	{path: '/home/...', component: HomeComponent, as: 'Home'},
])

export class AppComponent {
	
}