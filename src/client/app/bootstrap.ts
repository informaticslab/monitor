import {bootstrap} from '@angular/platform-browser-dynamic';
import {AppComponent} from './components/app/app.component'
import {LocationStrategy, HashLocationStrategy} from '@angular/common'
import {bind} from '@angular/core'

bootstrap(AppComponent, [bind(LocationStrategy).toClass(HashLocationStrategy)])
	.then(success => console.log(`Bootstrap success `))
	.catch(error => console.log(error));