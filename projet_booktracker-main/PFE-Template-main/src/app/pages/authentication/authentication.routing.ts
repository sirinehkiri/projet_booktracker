import { Routes } from '@angular/router';

import { AppBoxedForgotPasswordComponent } from './boxed-forgot-password/boxed-forgot-password.component';
import { AppBoxedRegisterComponent } from './boxed-register/boxed-register.component';
import { AppSideLoginComponent } from './side-login/side-login.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'boxed-forgot-pwd',
        component: AppBoxedForgotPasswordComponent,
      },
      {
        path: 'boxed-register',
        component: AppBoxedRegisterComponent,
      },
      {
        path: 'side-login',
        component: AppSideLoginComponent,
      },
    ],
  },
];
