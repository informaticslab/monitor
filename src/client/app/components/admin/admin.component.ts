import {Component} from '@angular/core';
import {Router, RouteConfig} from '@angular/router-deprecated';
import {Service, MonitorService} from '../../services/hosts.service';

@Component({
  selector: 'admin',
  templateUrl: './app/components/admin/admin.component.html'
})

export class AdminComponent {
  errorMessage: string;
  services: Service[];

  constructor(
    private _monitorService: MonitorService
  ) { }

  ngOnInit() {
    this.getHostList();
  }

  getHostList(){
  this._monitorService.getServices()
    .subscribe(
      services => this.services = services,
      error => this.errorMessage = <any>error
    );
  }

}