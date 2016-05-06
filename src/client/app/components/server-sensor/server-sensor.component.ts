import {Component} from 'angular2/core';
import {SensorData, ServerSensorService} from '../../services/server-sensor.service';

@Component({
	selector: 'server-sensor',
	templateUrl: './app/components/server-sensor/server-sensor.component.html',
	styleUrls: ['./app/components/server-sensor/server-sensor.component.css']
})

export class ServerSensorComponent {
	errorMessage: string;
	sensorData: JSON;

	constructor(
		private _serverSensorService: ServerSensorService
	) {}

	ngOnInit() {
		// this.getServerSensorData();
	}

	getServerSensorData() {
		setInterval(() => {
			this._serverSensorService.getSensorData()
				.subscribe(
				sensorData => this.sensorData = sensorData,
				error => this.errorMessage = <any>error);
		},
			5000)
	}

	private mockTempF = 76.3;
	private mockHumidity = 39.5;
}