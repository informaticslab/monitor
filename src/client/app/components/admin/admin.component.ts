import {Component} from '@angular/core';
import {Router, RouteConfig,ROUTER_DIRECTIVES} from '@angular/router-deprecated';
// import {Service, MonitorService} from '../../services/hosts.service';
import {ServiceListComponent} from '../service-list/service-list.component';
import {AddServiceComponent} from '../add-service/add-service.component';


@Component({
  selector: 'admin',
  templateUrl: './app/components/admin/admin.component.html',
  styleUrls: ['./app/components/admin/admin.component.css'],
  directives: [
    ServiceListComponent,
    AddServiceComponent,
    ROUTER_DIRECTIVES
  ]
})

@RouteConfig([
  {path: '/', component:ServiceListComponent, as: 'ServiceList', useAsDefault:true},
  {path: '/addservice', component:AddServiceComponent, as: 'AddService'}
])

export class AdminComponent {
  errorMessage: string;
  // services: Service[];

  constructor(
    // private _monitorService: MonitorService
  ) { }

  ngOnInit() {
    // this.getHostList();
  }

  // getHostList(){
  // this._monitorService.getServices()
  //   .subscribe(
  //     services => this.services = services,
  //     error => this.errorMessage = <any>error
  //   );
  // }

}