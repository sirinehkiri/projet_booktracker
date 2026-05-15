import { Routes } from '@angular/router';

// theme pages
import { AppAccountSettingComponent } from './account-setting/account-setting.component';

export const ThemePagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'account-setting',
        component: AppAccountSettingComponent,
        data: {
          title: 'Account Setting',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Account Setting' },
          ],
        },
      },
    ],
  },
];
