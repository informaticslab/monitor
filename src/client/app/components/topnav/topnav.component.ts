import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
// import {Dropdown, DropdownToggle} from 'ng2-bootstrap/ng2-bootstrap';
// import {DROPDOWN_DIRECTIVES, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'topnav',
    templateUrl: './app/components/topnav/topnav.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

export class TopnavComponent {

}