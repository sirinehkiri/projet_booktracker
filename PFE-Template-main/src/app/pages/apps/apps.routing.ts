import { Routes } from '@angular/router';

import { AppChatComponent } from './chat/chat.component';
import { AppNotesComponent } from './notes/notes.component';
import { ReadingGoalComponent } from './reading-goal/reading-goal.component';
import { AppTaskboardComponent } from './taskboard/taskboard.component';
import { AppTicketlistComponent } from './ticketlist/ticketlist.component';
import { AppContactComponent } from './contact/contact.component';
import { AppEmployeeComponent } from './employee/employee.component';
import { AppInvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { AppAddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { AppInvoiceViewComponent } from './invoice/invoice-view/invoice-view.component';
import { AppEditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';
import { AppBlogsComponent } from '../blogs/blogs.component';
import { AppBlogDetailsComponent } from '../blogs/details/details.component';

export const AppsRoutes: Routes = [
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
      {
        path: 'notes',
        component: AppNotesComponent,
        data: {
          title: 'Notes',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Notes' },
          ],
        },
      },
      { path: 'email', redirectTo: 'email/inbox', pathMatch: 'full' },
      {
        path: 'reading-goal',
        component: ReadingGoalComponent
      },
      {
        path: 'taskboard',
        component: AppTaskboardComponent,
        data: {
          title: 'Taskboard',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Taskboard' },
          ],
        },
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
        path: 'invoice',
        component: AppInvoiceListComponent,
        data: {
          title: 'Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Invoice' },
          ],
        },
      },
      {
        path: 'addInvoice',
        component: AppAddInvoiceComponent,
        data: {
          title: 'Add Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Add Invoice' },
          ],
        },
      },
      {
        path: 'viewInvoice/:id',
        component: AppInvoiceViewComponent,
        data: {
          title: 'View Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'View Invoice' },
          ],
        },
      },
      {
        path: 'editinvoice/:id',
        component: AppEditInvoiceComponent,
        data: {
          title: 'Edit Invoice',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Edit Invoice' },
          ],
        },
      },
    ],
  },
];
