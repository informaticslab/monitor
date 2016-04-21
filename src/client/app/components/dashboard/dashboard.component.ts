import {Component} from 'angular2/core';
import {Report, ReportService} from '../../services/reports.service';
import {LineChart} from 'primeng/primeng';


@Component({
	selector: 'dashboard',
	templateUrl: './app/components/dashboard/dashboard.component.html',
	styleUrls: ['./app/components/dashboard/dashboard.component.css']
})

export class DashboardComponent {
	errorMessage: string;
	reports: Report[];

	constructor(private _reportService: ReportService) {}

	ngOnInit() {
		this.getReports();
	}

	getReports() {
		this._reportService.getReports()
			.subscribe(
			reports => this.reports = reports,
			error => this.errorMessage = <any>error
			);
	}

	
}

export class LineChartDemo {

    data: any;

    // msgs: Message[];

    constructor() {
        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fillColor: 'rgba(220,220,220,0.2)',
                    strokeColor: 'rgba(220,220,220,1)',
                    pointColor: 'rgba(220,220,220,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    fillColor: 'rgba(151,187,205,0.2)',
                    strokeColor: 'rgba(151,187,205,1)',
                    pointColor: 'rgba(151,187,205,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151,187,205,1)',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        }
    }

    // onSelect(event) {
    //     if (event.points) {
    //         this.msgs = [];
    //         for (var i = 0; i < event.points.length; i++) {
    //             this.msgs.push({ severity: 'info', summary: 'Points Selected', 'detail': event.points[i].value });
    //         }

    //     }
    // }
}