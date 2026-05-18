import { Routes } from '@angular/router';

import { AppChatComponent } from './chat/chat.component';
import { ReadingGoalComponent } from './reading-goal/reading-goal.component';
import { AppTicketlistComponent } from './ticketlist/ticketlist.component';
import { AppContactComponent } from './contact/contact.component';
import { AppEmployeeComponent } from './employee/employee.component';
import { AppBlogsComponent } from '../blogs/blogs.component';
import { AppBlogDetailsComponent } from '../blogs/details/details.component';
import { MyBookListsComponent } from './my-book-lists/my-book-lists.component';
import { RecommendationsComponent } from './contact/recommendations.component';
import { PreferencesComponent } from './preferences/preferences.component';
export const AppsRoutes: Routes = [
    {
        path: 'mes-listes',
        component: MyBookListsComponent
      },
  {
    path: '',
    children: [
      {
        path: 'chat',
        component: AppChatComponent,
        data: {
          title: 'Chat',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Chat' },
          ],
        },
      },
      { path: 'email', redirectTo: 'email/inbox', pathMatch: 'full' },
      {
        path: 'reading-goal',
        component: ReadingGoalComponent
      },
      {
        path: 'tickets',
        component: AppTicketlistComponent,
        data: {
          title: 'Tickets',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Tickets' },
          ],
        },
      },
      {  
        path: 'contacts',
        component: AppContactComponent,
        data: {
          title: 'Contacts',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Contacts' },
          ],
        },
      },
      {
        path: 'blog/post',
        component: AppBlogsComponent,
        data: {
          title: 'Posts',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Posts' },
          ],
        },
      },
      {
        path: 'blog/detail/:id',
        component: AppBlogDetailsComponent,
        data: {
          title: 'Blog Detail',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Blog Detail' },
          ],
        },
      },
      {
        path: 'employee',
        component: AppEmployeeComponent,
        data: {
          title: 'Employee',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Employee' },
          ],
        },
      },
       {
        path: 'recommendations', 
        component: RecommendationsComponent,
        data: { title: 'Recommendations' }
      },
       {
        path: 'preferences',  
        component: PreferencesComponent,
        data: { title: 'Preferences' }
      }
    ],
  },
];
