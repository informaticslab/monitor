import {Component} from '@angular/core';
import {Service, MonitorService} from '../../services/hosts.service';

@Component({
	selector: 'service-list',
	templateUrl: '/app/components/service-list/service-list.component.html'
})

export class ServiceListComponent {
	errorMessage: string;
	services: Service[];

	constructor(private _monitorService: MonitorService) {}

	// ngOnInit() {
	// 	this.getHostList();
	// }

	getHostList(){
		this._monitorService.getServices()
			.subscribe(
				services => this.services = services,
				error => this.errorMessage = <any>error
			);
	}
}