import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'aperture',
    route: '/dashboards/dashboard1',
  },
  
  {
    navCap: 'Apps',
  },
  
  {
    displayName: 'Ajouter Amis',
    iconName: 'phone',
    route: 'apps/contacts',
  },
  {
    displayName: 'Tickets',
    iconName: 'ticket',
    route: 'apps/tickets',
  },
  {
    displayName: 'ToDo',
    iconName: 'edit',
    route: 'apps/todo',
  },
  {
    displayName: 'Taskboard',
    iconName: 'checklist',
    route: 'apps/taskboard',
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
    displayName: 'Pricing',
    iconName: 'currency-dollar',
    route: 'theme-pages/pricing',
  },
  {
    displayName: 'Account Setting',
    iconName: 'user-circle',
    route: 'theme-pages/account-setting',
  },
  {
    displayName: 'Widgets',
    iconName: 'layout',
    route: 'widgets',
    children: [
      {
        displayName: 'Cards',
        iconName: 'point',
        route: 'widgets/cards',
      },
      {
        displayName: 'Banners',
        iconName: 'point',
        route: 'widgets/banners',
      },
      {
        displayName: 'Charts',
        iconName: 'point',
        route: 'widgets/charts',
      },
    ],
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
        displayName: 'Multi Header Footer',
        iconName: 'point',
        route: 'tables/multi-header-footer-table',
      },
      {
        displayName: 'Pagination Table',
        iconName: 'point',
        route: 'tables/pagination-table',
      },
      {
        displayName: 'Row Context Table',
        iconName: 'point',
        route: 'tables/row-context-table',
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
      {
        displayName: 'Sticky Header Footer',
        iconName: 'point',
        route: 'tables/sticky-header-footer-table',
      },
    ],
  },
  {
    displayName: 'Data table',
    iconName: 'border-outer',
    route: '/datatable/kichen-sink',
  },
  {
    navCap: 'Chart',
  },
  {
    displayName: 'Doughnut & Pie',
    iconName: 'chart-donut-3',
    route: '/charts/doughnut-pie',
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
      {
        displayName: 'Progress Bar',
        iconName: 'point',
        route: 'ui-components/progress',
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
