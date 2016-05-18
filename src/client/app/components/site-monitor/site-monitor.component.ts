import {Component} from '@angular/core';
import {Report, ReportService} from '../../services/report.service';


@Component({
	selector: 'site-monitor',
	templateUrl: './app/components/site-monitor/site-monitor.component.html',
	styleUrls: ['./app/components/site-monitor/site-monitor.component.css']
})

export class SiteMonitorComponent {
	errorMessage: string;
	reports: Report[];
	refreshedTimestamp: number;

	constructor(private _reportService: ReportService) {}

	ngOnInit() {
		this.getReports();
		// this.refreshedTimestamp = +new Date();
	}

	ngAfterContentInit() {
		this.autoRefresh();
	}

	getReports() {
		this._reportService.getReports()
			.subscribe(
				reports => this.reports = reports,
				error => this.errorMessage = <any>error
			);
	}

	autoRefresh() {
		setInterval(() => {
			this.getReports();
			// this.refreshedTimestamp = +new Date()
		}, 90000);
	}

}
