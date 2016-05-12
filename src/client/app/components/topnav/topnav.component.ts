import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {RouteConfig, ROUTER_DIRECTIVES} from '@angular/router-deprecated';


@Component({
    selector: 'topnav',
    templateUrl: './app/components/topnav/topnav.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

export class TopnavComponent {
	reloadPage() {
		window.location.reload();
	}
}