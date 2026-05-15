import { Routes } from '@angular/router';

// dashboards
import { StatisticsComponent } from './dashboard1/dashboard1.component';

export const DashboardsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: StatisticsComponent,
        data: {
          title: 'Analytical',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Analytical' },
          ],
        },
      },
    ],
  },
];
