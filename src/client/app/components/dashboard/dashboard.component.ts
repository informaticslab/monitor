import {Component} from '@angular/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {LabReservationComponent} from '../lab-reservations/lab-reservations.component';
import {WeatherComponent} from '../weather/weather.component';
import {SiteMonitorComponent} from '../site-monitor/site-monitor.component';
import {IssueMetricsComponent} from '../issue-metrics/issue-metrics.component';
import {ServerSensorComponent} from '../server-sensor/server-sensor.component';
import {UnresolvedIssuesComponent} from '../unresolved-issues/unresolved-issues.component';
import {AdminComponent} from '../admin/admin.component';
// import moment from 'moment/moment';


@Component({
	selector: 'dashboard',
	templateUrl: './app/components/dashboard/dashboard.component.html',
	styleUrls: ['./app/components/dashboard/dashboard.component.css'],
	directives: [
		CHART_DIRECTIVES, 
		WeatherComponent, 
		SiteMonitorComponent,
		LabReservationComponent,
		IssueMetricsComponent,
		ServerSensorComponent,
		UnresolvedIssuesComponent,
		AdminComponent
	]
})

export class DashboardComponent {
	errorMessage: string;

	ngOnInit() {
		this.getCurrentTime();
	}

	d = new Date();
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	currentDate = this.monthNames[this.d.getMonth()] + " " + this.d.getDate() + ", " + this.d.getFullYear();
	currentTime = '';

	getCurrentTime() {
		setInterval(()=>{
			var time = new Date();
			var hours = time.getHours();
			var minutes = time.getMinutes();
			var s = time.getSeconds();

			var ampm = hours <= 11 ? ' AM' : ' PM';
			var strTime = [(hours === 12 ? "12": hours % 12),
				(minutes < 10 ? "0" + minutes : minutes)
			].join(':') + ampm;

			this.currentTime = strTime;
		},
		1000)
	}

	
}

