import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app/app.component'
// import {LocationStrategy, HashLocationStrategy} from 'angular2/router'
// import {bind} from 'angular2/core'

bootstrap(AppComponent)
	.then(success => console.log(`Bootstrap success `))
	.catch(error => console.log(error));