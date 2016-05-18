import {Component} from '@angular/core';
import {WeatherReport, WeatherService} from '../../services/weather.service';

@Component({
	selector:'weather-widget',
	templateUrl:'./app/components/weather/weather.component.html',
	styleUrls: ['./app/components/weather/weather.component.css']
})


export class WeatherComponent {
	errorMessage: string;
	weatherReport: WeatherReport;

	constructor(
		private _weatherService: WeatherService
	) {}

	ngOnInit() {
		this.getCurrentWeather();
	}

	ngAfterContentInit() {
		setInterval(() => {
			this.getCurrentWeather();
		}, 90000);
	}

	getCurrentWeather() {
		this._weatherService.getCurrentConditions()
			.subscribe(
			weather => this.weatherReport = weather,
			error => this.errorMessage = <any>error
			);
	}

	setStyle() {
		if (this.weatherReport.current_observation.temp_f <= 72) {
			return '#00BCD4';
		} else if (this.weatherReport.current_observation.temp_f >= 72 && this.weatherReport.current_observation.temp_f < 85)  {
			return '#EF6C00';
		} else {
			return '#C62828';
		}
	}

}