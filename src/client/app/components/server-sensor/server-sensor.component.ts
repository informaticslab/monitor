import {Component} from '@angular/core';
import {SensorData, ServerSensorService} from '../../services/server-sensor.service';

@Component({
	selector: 'server-sensor',
	templateUrl: './app/components/server-sensor/server-sensor.component.html',
	styleUrls: ['./app/components/server-sensor/server-sensor.component.css']
})

export class ServerSensorComponent {
	errorMessage: string;
	sensorData: SensorData;

	constructor(
		private _serverSensorService: ServerSensorService
	) {}

	ngOnInit() {
		this.getServerSensorData();
	}

	ngAfterContentInit() {
		setInterval(() => {
			this.getServerSensorData();
		}, 300000);
	}

	getServerSensorData() {
			this._serverSensorService.getSensorData()
				.subscribe(
				sensorData => this.sensorData = sensorData,
				error => this.errorMessage = <any>error);
	}

	setStyle() {
		if (this.sensorData.temperature < 89) {
			return '#009688';
		} else if (this.sensorData.temperature >= 89 && this.sensorData.temperature < 93) {
			return '#EF6C00';
		} else {
			return '#C62828';
		}
	}

}