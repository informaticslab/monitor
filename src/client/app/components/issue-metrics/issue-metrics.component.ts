import {Component} from 'angular2/core';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {JiraReservations, JiraService} from '../../services/jira.service';

@Component({
	selector: 'issue-metrics',
	templateUrl: './app/components/issue-metrics/issue-metrics.component.html',
	styleUrls: ['./app/components/issue-metrics/issue-metrics.component.css'],
	directives: [CHART_DIRECTIVES]
})

export class IssueMetricsComponent {
	errorMessage: string;
	issues: JiraReservations[];

	constructor(
		private _jiraService: JiraService
	) { }

	ngOnInit(){
		this.getCompletedIssues();
	}


	// events
	chartClicked(e: any) {
		// console.log(e);
	}

	chartHovered(e: any) {
		// console.log(e);
	}

	private doughnutChartLabels = ['Resolved Tickets', 'Pending Tickets', 'Open Tickets'];
	private doughnutChartData = this.issues;
	private doughnutChartType = 'Doughnut';

	getCompletedIssues() {
		this._jiraService.getIssues()
			.subscribe(
			issues => this.issues = issues,
			error => this.errorMessage = <any>error
			);
	}


}