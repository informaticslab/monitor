import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
@Component({
	selector: 'login',
	templateUrl: './app/components/login/login.component.html',
	styleUrls: ['./app/components/login/login.component.css']
})

export class LoginComponent {
	constructor(private _router: Router) { }
	goToHome() {
		this._router.navigate(['Home']);
	}
	gotoSignup() {
		this._router.navigate(['Signup']);
	}
}
