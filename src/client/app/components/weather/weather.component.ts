import {Component} from 'angular2/core';
import {WeatherReport, WeatherService} from '../../services/weather.service';

@Component({
	selector:'weather-widget',
	templateUrl:'./app/components/weather/weather.component.html',
	styleUrls: ['./app/components/weather/weather.component.css']
})


export class WeatherComponent {
	errorMessage: string;
	weatherReport: WeatherReport[];

	constructor(
		private _weatherService: WeatherService
	) {}

	ngOnInit() {
		this.getCurrentWeather();
	}

	getCurrentWeather() {
		this._weatherService.getCurrentConditions()
			.subscribe(
			weather => this.weatherReport = weather,
			error => this.errorMessage = <any>error
			);
	}

}