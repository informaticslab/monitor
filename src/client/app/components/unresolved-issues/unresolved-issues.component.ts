import {Component} from 'angular2/core';
import {JiraReservations, JiraService} from '../../services/jira.service';

@Component({
	selector: 'unresolved-issues',
	templateUrl: './app/components/unresolved-issues/unresolved-issues.component.html',
	styleUrls: ['./app/components/unresolved-issues/unresolved-issues.component.css']
})

export class UnresolvedIssuesComponent {
	errorMessage: string;
	unresolvedList: JiraReservations[];

	constructor(
		private _jiraService: JiraService
	){}

	ngOnInit() {
		this.getUnresolvedList();
	}

	getUnresolvedList() {
		this._jiraService.getUnresolved()
			.subscribe(
			unresolvedList => this.unresolvedList = unresolvedList,
			error => this.errorMessage = <any>error
			);
	}
}