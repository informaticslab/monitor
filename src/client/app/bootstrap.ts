import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './components/app/app.component'
import {HTTP_PROVIDERS} from 'angular2/http';

bootstrap(AppComponent, [HTTP_PROVIDERS])
	.then(success => console.log(`Bootstrap success `))
	.catch(error => console.log(error));