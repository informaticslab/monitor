import {Component} from 'angular2/core';
import {Report, ReportService} from '../../services/reports.service';

@Component({
	selector: 'report',
	templateUrl: '/app/components/reports/report.component.html'
})

export class ReportComponent {
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
