import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteConfig, ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Dropdown, DropdownToggle} from 'ng2-bootstrap/ng2-bootstrap';
import {DROPDOWN_DIRECTIVES, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'topnav',
    templateUrl: './app/components/topnav/topnav.component.html',
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
})

export class TopnavComponent {
    public oneAtATime: boolean = true;
    public items: Array<any> = [{ name: 'google', link: 'https://google.com' }, { name: 'facebook', link: 'https://facebook.com' }];
    public status: Object = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
    constructor(private _router: Router) { }
    gotoDashboard() {
        this._router.navigate(['Home']);
    }
    gotoLogin() {
        this._router.navigate(['Login']);
    }
}