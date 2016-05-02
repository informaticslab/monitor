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
	completedIssues: JSON;
	unresolvedIssues: JSON;
	canceledIssues: JSON;

	constructor(
		private _jiraService: JiraService
	) { }

	ngOnInit(){
		
	}

	private doughnutChartLabels = ['Resolved Tickets', 'Pending Tickets', 'Open Tickets'];
	private doughnutChartData = [60, 10, 30];
	private doughnutChartType = 'Doughnut';

	getCompletedIssues() {
		this._jiraService.getCompletedIssues()
			.subscribe(
				completedIssues => this.completedIssues = completedIssues,
				error => this.errorMessage = <any>error
			);
	}
}