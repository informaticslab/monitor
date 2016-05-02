import {Component} from 'angular2/core';
import {JiraReservations, JiraService} from '../../services/jira.service';

@Component({
	selector: 'lab-reservations',
	templateUrl: './app/components/lab-reservations/lab-reservations.component.html',
	styleUrls: ['./app/components/lab-reservations/lab-reservations.component.css']
})

export class LabReservationComponent {
	errorMessage: string;
	jiraReservations: JiraReservations[];

	constructor(
		private _jiraService: JiraService
	) { }

	ngOnInit() {
		this.getJiraReservations();
	}

	getJiraReservations() {
		this._jiraService.getReservations()
			.subscribe(
			jiraReservations => this.jiraReservations = jiraReservations,
			error => this.errorMessage = <any>error
			);
	}
}