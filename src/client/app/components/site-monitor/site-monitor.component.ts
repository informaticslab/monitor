import {Component} from 'angular2/core';
import {Report, ReportService} from '../../services/report.service';

@Component({
	selector: 'site-monitor',
	templateUrl: '/app/components/site-monitor/site-monitor.component.html',
	styleUrls: ['./app/components/site-monitor/site-monitor.component.css']
})

export class SiteMonitorComponent {
	errorMessage: string;
	reports: Report[];

	constructor(private _reportService: ReportService) {}

	ngOnInit() {
		this.getReports();
	}

	getReports() {
		this._reportService.getReports()
			.subscribe(
				reports => this.reports = reports,
				error => this.errorMessage = <any>error
			);
	}
}
