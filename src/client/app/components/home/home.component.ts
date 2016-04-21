import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopnavComponent} from '../topnav/topnav.component';
// import {SidebarComponent} from '../sidebar/sidebar.component';
import {ReportComponent} from '../reports/report.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
// import {bootstrap} from 'angular2/platform/browser';

@Component({
	selector: 'home',
	templateUrl: './app/components/home/home.component.html',
	directives: [ROUTER_DIRECTIVES, TopnavComponent]
})
@RouteConfig([
	{path: '/', component:DashboardComponent, as: 'Dashboard', useAsDefault:true},
	{path: '/report', component:ReportComponent, as: 'Report'}
])

export class HomeComponent {
	mobileView: number = 992;
	toggle: boolean = false;
	;
	constructor() {
		this.attachEvents();
	}

	attachEvents() {
		window.onresize = () => {
			if (this.getWidth() >= this.mobileView) {
				if (localStorage.getItem('toggle')) {
					this.toggle = !localStorage.getItem('toggle') ? false : true;
				} else {
					this.toggle = true;
				}
			} else {
				this.toggle = false;
			}
		}
	}

	getWidth() {
		return window.innerWidth
	}

	toggleSidebar() {
		this.toggle = !this.toggle;
		localStorage.setItem('toggle', this.toggle.toString());
	}
}	