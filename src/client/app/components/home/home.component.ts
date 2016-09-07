import {Component, ViewEncapsulation} from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {TopnavComponent} from '../topnav/topnav.component';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {LoginComponent} from '../login/login.component';
import {AdminComponent} from '../admin/admin.component';

@Component({
	selector: 'home',
	templateUrl: './app/components/home/home.component.html',
	directives: [ROUTER_DIRECTIVES, TopnavComponent]
})
@RouteConfig([
	{path: '/', component:DashboardComponent, as: 'Dashboard', useAsDefault:true},
	{path: '/admin/...', component: AdminComponent, as: 'Admin'},
	{path: '/login', component:LoginComponent, as: 'Login'}
])

export class HomeComponent {
	mobileView: number = 992;
	toggle: boolean = false;

	constructor() {
		// this.attachEvents();
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