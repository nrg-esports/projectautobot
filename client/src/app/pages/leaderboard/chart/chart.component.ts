import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ow-leaderboard-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.scss']
})
export class LeaderboardChartComponent implements OnInit {

  data = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "USA2",
      "value": 5000000
    },
    {
      "name": "USA3",
      "value": 5000000
    },
    {
      "name": "USA4",
      "value": 5000000
    },
    {
      "name": "USA5",
      "value": 5000000
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  yAxisLabel = 'Population';

  constructor() {}

  ngOnInit() {}

}
