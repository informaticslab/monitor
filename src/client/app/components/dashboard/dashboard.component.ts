import {Component} from 'angular2/core';
import {InputText, Schedule} from 'primeng/primeng';
import {CHART_DIRECTIVES} from 'ng2-charts/ng2-charts';
import {JiraResults, JiraService} from '../../services/jira.service';
import {WeatherComponent} from '../weather/weather.component';
import {SiteMonitorComponent} from '../site-monitor/site-monitor.component';
// import moment from 'moment/moment';


@Component({
	selector: 'dashboard',
	templateUrl: './app/components/dashboard/dashboard.component.html',
	styleUrls: ['./app/components/dashboard/dashboard.component.css'],
	directives: [InputText, CHART_DIRECTIVES, WeatherComponent, SiteMonitorComponent]
})

export class DashboardComponent {
	errorMessage: string;
	jiraResults: JiraResults[];

	constructor(
		private _jiraService: JiraService
	) {}

	ngOnInit() {
		this.getCurrentTime();
		this.getJiraIssues();
	}

	getJiraIssues(){
		this._jiraService.getSDIssues()
			.subscribe(
			issues => this.jiraResults = issues,
			error => this.errorMessage = <any>error
			);
	}

	d = new Date();
	monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	currentDate = this.monthNames[this.d.getMonth()] + " " + this.d.getDate() + ", " + this.d.getFullYear();
	currentTime = '';

	getCurrentTime() {
		setInterval(()=>{
			var time = new Date();
			var hours = time.getHours();
			var minutes = time.getMinutes();
			var s = time.getSeconds();

			var ampm = hours <= 11 ? 'am' : 'pm';
			var strTime = [hours % 12,
				(minutes < 10 ? "0" + minutes : minutes)
			].join(':') + ampm;

			this.currentTime = strTime;
		},
		1000)
	}

	// Will need to pull this out think
	private lineChartData: Array<any> = [
		[65, 59, 80, 81, 56, 55, 40],
		[28, 48, 40, 19, 86, 27, 90]
	];
	private lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	private lineChartSeries: Array<any> = ['Series A', 'Series B', 'Series C'];
	private lineChartOptions: any = {
		animation: false,
		responsive: true,
		multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
	};
	private lineChartColours: Array<any> = [
		{ // grey
			fillColor: 'rgba(148,159,177,0.2)',
			strokeColor: 'rgba(148,159,177,1)',
			pointColor: 'rgba(148,159,177,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(148,159,177,0.8)'
		},
		{ // dark grey
			fillColor: 'rgba(77,83,96,0.2)',
			strokeColor: 'rgba(77,83,96,1)',
			pointColor: 'rgba(77,83,96,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(77,83,96,1)'
		},
		{ // grey
			fillColor: 'rgba(148,159,177,0.2)',
			strokeColor: 'rgba(148,159,177,1)',
			pointColor: 'rgba(148,159,177,1)',
			pointStrokeColor: '#fff',
			pointHighlightFill: '#fff',
			pointHighlightStroke: 'rgba(148,159,177,0.8)'
		}
	];
	private lineChartLegend: boolean = true;
	private lineChartType: string = 'Line';

	private randomize() {
		let _lineChartData: Array<any> = [];
		for (let i = 0; i < this.lineChartData.length; i++) {
			_lineChartData[i] = [];
			for (let j = 0; j < this.lineChartData[i].length; j++) {
				_lineChartData[i].push(Math.floor((Math.random() * 100) + 1));

			}
		}
		this.lineChartData = _lineChartData;
	}

	// events
	chartClicked(e: any) {
		// console.log(e);
	}

	chartHovered(e: any) {
		// console.log(e);
	}

	private doughnutChartLabels = ['Resolved Tickets', 'Pending Tickets', 'Open Tickets'];
	private doughnutChartData = [60, 10, 30];
	private doughnutChartType = 'Doughnut';

	////////////////////////////
	//CLOCK
	////////////////////////////
	getTimeAndDate() {

		// let d = new Date();
		// let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var d = new Date();
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



		function getDate() {
			this.currentDate = monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
		}

		function timer() {
			setTimeout(timer, 1000);
			var d = new Date();
			var hours = d.getHours();
			var minutes = d.getMinutes();
			var ampm = hours <= 11 ? 'am' : 'pm';
			var strTime = [hours % 12,
				(minutes < 10 ? "0" + minutes : minutes)
			].join(':') + ampm;
			this.currentTime = strTime;
			setTimeout(timer, 1000);
		}

		getDate();
		timer();
	}
	
	
}

