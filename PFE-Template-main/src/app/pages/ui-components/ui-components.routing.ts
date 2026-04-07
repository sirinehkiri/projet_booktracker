import { Routes } from '@angular/router';

// ui
import { AppPaginatorComponent } from './paginator/paginator.component';
import { AppProgressComponent } from './progress/progress.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'paginator',
        component: AppPaginatorComponent,
        data: {
          title: 'Paginator',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Paginator' },
          ],
        },
      },
      {
        path: 'progress',
        component: AppProgressComponent,
        data: {
          title: 'Progress',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Progress' },
          ],
        },
      },
    ]
  },
];
