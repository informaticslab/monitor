import {Component} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';

import {MonitorService, Service} from '../../services/hosts.service';
import {ReportService, Report} from '../../services/report.service';
import {WeatherReport, WeatherService} from '../../services/weather.service';
import {JiraReservations, JiraService} from '../../services/jira.service';
import {SensorData, ServerSensorService} from '../../services/server-sensor.service';
import {HomeComponent} from '../home/home.component';
// import {LoginComponent} from '../login/login.component';


@Component({
	selector: 'app',
	templateUrl: './app/components/app/app.component.html',
	directives: [
		ROUTER_DIRECTIVES
	],
	providers: [
		ROUTER_PROVIDERS,
		HTTP_PROVIDERS,
		MonitorService,
		ReportService,
		WeatherService,
		JiraService,
		ServerSensorService
	]
})

@RouteConfig([
	// {path: '/login', component: LoginComponent, as: 'Login', useAsDefault:true},
	{path: '/home/...', component: HomeComponent, as: 'Home', useAsDefault: true}
])

export class AppComponent {}