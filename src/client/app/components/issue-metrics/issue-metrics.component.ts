import {Component} from '@angular/core';
import {CORE_DIRECTIVES, NgClass} from '@angular/common';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {JiraReservations} from '../../services/jira.service';
import {JiraService} from '../../services/jira.service';
@Component({
	selector: 'issue-metrics',
	templateUrl: './app/components/issue-metrics/issue-metrics.component.html',
	styleUrls: ['./app/components/issue-metrics/issue-metrics.component.css'],
	directives: [CHART_DIRECTIVES, NgClass, CORE_DIRECTIVES]
})

export class IssueMetricsComponent {
	errorMessage: string;
	issues: JiraReservations[];

	constructor(
		private _jiraService: JiraService
	) { }

	ngOnInit(){
		this.getIssuesMetrics();
	}


	// events
	chartClicked(e: any) {
		// console.log(e);
	}

	chartHovered(e: any) {
		// console.log(e);
	}

	private doughnutChartLabels:string[] = ['Completed', 'Unresolved', 'Canceled'];
	private doughnutChartType:string = 'doughnut';
	private doughnutChartLegend:boolean = true;
	private options:any = { 
		legend:{
			labels:{
				fontColor: '#FFF'
			},
			position: 'bottom'
		},
		responsive: true
	};
	// private colors: Array<any> = [{ fillColor: '#8EB021' }, { fillColor: '#3B7FC4' }, { fillColor: '#D04437' }];
	

	getIssuesMetrics() {
		this._jiraService.getIssues()
			.subscribe(
			issues => this.issues = issues,
			error => this.errorMessage = <any>error
			);
	}


}