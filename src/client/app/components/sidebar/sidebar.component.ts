import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';



@Component({
	selector: 'sidebar',
	templateUrl: './app/components/sidebar/sidebar.component.html',
	directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class SidebarComponent {
	isActive = false;
	public oneAtATime: boolean = true;

	public status: Object = {
		isFirstOpen: false,
		isFirstDisabled: false
	};

	public groups: Array<any> = [
		{
			title: 'Dynamic Group Header - 1',
			content: 'Dynamic Group Body - 1'
		},
		{
			title: 'Dynamic Group Header - 2',
			content: 'Dynamic Group Body - 2'
		}
	];
	eventCalled() {
		this.isActive = !this.isActive;
	}
}
