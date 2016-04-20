import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './components/app/app.component'
import {LocationStrategy, HashLocationStrategy} from 'angular2/router'
import {bind} from 'angular2/core'

bootstrap(AppComponent, [bind(LocationStrategy).toClass(HashLocationStrategy)])
	.then(success => console.log(`Bootstrap success `))
	.catch(error => console.log(error));