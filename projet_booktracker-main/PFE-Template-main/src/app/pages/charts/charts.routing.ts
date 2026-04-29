import { Routes } from '@angular/router';

// components
import { AppDoughnutpieChartComponent } from './doughnut-pie/doughnut-pie.component';

export const ChartsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'doughnut-pie',
        component: AppDoughnutpieChartComponent,
        data: {
          title: 'Doughnut-Pie Chart',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Doughnut-Pie Chart' },
          ],
        },
      },
    ],
  },
];
