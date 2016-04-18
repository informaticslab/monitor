import {Component, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {TopnavComponent} from '../topnav/topnav.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {ReportComponent} from '../reports/report.component';

@Component({
	selector: 'dashboard',
	templateUrl: './app/components/dashboard/dashboard.component.html',
	directives: [ROUTER_DIRECTIVES, SidebarComponent, TopnavComponent]
})
@RouteConfig([
	{path: '/', component:ReportComponent, as: 'Home', useAsDefault:true}
])

export class DashboardComponent { }	