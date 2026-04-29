import { Routes } from '@angular/router';

// tables
import { AppBasicTableComponent } from './basic-table/basic-table.component';
import { AppMixTableComponent } from './mix-table/mix-table.component';
import { AppPaginationTableComponent } from './pagination-table/pagination-table.component';
import { AppSelectionTableComponent } from './selection-table/selection-table.component';
import { AppSortableTableComponent } from './sortable-table/sortable-table.component';
import { AppStickyColumnTableComponent } from './sticky-column-table/sticky-column-table.component';
import { AppFilterableTableComponent } from './filterable-table/filterable-table.component';

export const TablesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic-table',
        component: AppBasicTableComponent,
        data: {
          title: 'Basic Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Basic Table' },
          ],
        },
      },
      {
        path: 'filterable-table',
        component: AppFilterableTableComponent,
        data: {
          title: 'Filterable Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Filterable Table' },
          ],
        },
      },
      {
        path: 'mix-table',
        component: AppMixTableComponent,
        data: {
          title: 'Mix Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Mix Table' },
          ],
        },
      },
      {
        path: 'pagination-table',
        component: AppPaginationTableComponent,
        data: {
          title: 'Pagination Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Pagination Table' },
          ],
        },
      },
      {
        path: 'selection-table',
        component: AppSelectionTableComponent,
        data: {
          title: 'Selection Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Selection Table' },
          ],
        },
      },
      {
        path: 'sortable-table',
        component: AppSortableTableComponent,
        data: {
          title: 'Sortable Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sortable Table' },
          ],
        },
      },
      {
        path: 'sticky-column-table',
        component: AppStickyColumnTableComponent,
        data: {
          title: 'Sticky Column Table',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sticky Column Table' },
          ],
        },
      },
    ],
  },
];
