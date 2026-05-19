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
];
