import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

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
