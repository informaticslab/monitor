import {bootstrap} from 'angular2/platform/browser'
import {AppComponent} from './components/app/app.component'

bootstrap(AppComponent, [])
	.then(success => console.log(`Boostrap sucess `))
	.catch(error => console.log(error));