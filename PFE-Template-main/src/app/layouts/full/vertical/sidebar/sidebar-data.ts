import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'aperture',
    route: 'dashboards/dashboard1',
  },
  
  {
    navCap: 'Apps',
  },
  
  {
    displayName: 'Friends',
    iconName: 'phone',
    route: 'apps/contacts',
  },
  {
    displayName: 'My Books',
    iconName: 'ticket',
    route: 'apps/tickets',
  },
  {
    displayName: 'Goals',
    iconName: 'edit',
    route: 'apps/reading-goal',
  },
  {
    displayName: 'Books',
    iconName: 'point',
    route: 'apps/blog/post',
  },
  {
    navCap: 'Pages',
  },
  {
    displayName: 'Account Setting',
    iconName: 'user-circle',
    route: 'theme-pages/account-setting',
  },
  {
    navCap: 'Tables',
  },
  {
    displayName: 'Tables',
    iconName: 'layout',
    route: 'tables',
    children: [
      {
        displayName: 'Basic Table',
        iconName: 'point',
        route: 'tables/basic-table',
      },
      {
        displayName: 'Filterable Table',
        iconName: 'point',
        route: 'tables/filterable-table',
      },
      {
        displayName: 'Mix Table',
        iconName: 'point',
        route: 'tables/mix-table',
      },
      {
        displayName: 'Pagination Table',
        iconName: 'point',
        route: 'tables/pagination-table',
      },
      {
        displayName: 'Selection Table',
        iconName: 'point',
        route: 'tables/selection-table',
      },
      {
        displayName: 'Sortable Table',
        iconName: 'point',
        route: 'tables/sortable-table',
      },
      {
        displayName: 'Sticky Column',
        iconName: 'point',
        route: 'tables/sticky-column-table',
      },
    ],
  },
  {
    displayName: 'Data table',
    iconName: 'border-outer',
    route: '/datatable/kichen-sink',
  },
  {
    navCap: 'UI',
  },
  {
    displayName: 'Ui Components',
    iconName: 'box',
    route: 'ui-components',
    children: [
      {
        displayName: 'Paginator',
        iconName: 'point',
        route: 'ui-components/paginator',
      },
    ],
  },
  {
    navCap: 'Auth',
  },
  {
    displayName: 'Boxed Forgot Password',
    iconName: 'point',
    route: '/authentication/boxed-forgot-pwd',
  },
];
