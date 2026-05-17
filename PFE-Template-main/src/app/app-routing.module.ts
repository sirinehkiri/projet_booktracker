import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AddBookComponent } from './pages/admin/add-book/add-book.component';
import { EditBookComponent } from './pages/admin/edit-book/edit-book.component';
import { ReviewComponent } from './pages/blogs/review/review.component';
import { ReadingGoalComponent } from './pages/apps/reading-goal/reading-goal.component';
import { ProfileComponent } from './pages/apps/profil/profile.component';
import { MyBookListsComponent } from './pages/apps/my-book-lists/my-book-lists.component';
const routes: Routes = [
  {
  path: 'mes-listes',
  component: MyBookListsComponent
},
  {
    path: 'review/:id',
    component: ReviewComponent
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path:'admin/add-book',
        component:AddBookComponent
      },
      {
        path:'admin/edit-book/:id',
        component:EditBookComponent
      },
      {
        path: '',
        redirectTo: '/authentication/side-login',
        pathMatch: 'full',
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/apps/apps.module').then((m) => m.AppsModule),
      },
      { path: 'profil/:id', 
        component: ProfileComponent
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.module').then(
            (m) => m.ThemePagesModule
          ),  
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
