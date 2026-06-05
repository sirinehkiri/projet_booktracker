import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { ChatService } from '../../../../pages/apps/chat/chat.service';
import { NotificationService } from 'src/app/services/notification.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-header',

  standalone: true,

  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    FormsModule
  ],

  templateUrl: './header.component.html',

  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent
implements OnInit, OnDestroy {

  // =====================================================
  // INPUTS / OUTPUTS
  // =====================================================

  @Input() showToggle = true;

  @Input() toggleChecked = false;

  @Output() toggleMobileNav =
    new EventEmitter<void>();

  @Output() toggleMobileFilterNav =
    new EventEmitter<void>();

  @Output() toggleCollapsed =
    new EventEmitter<void>();

  unreadChatMessagesCount: number = 0;

  unreadSenders: any[] = [];
  totalNotificationsCount: number = 0;

  private subs: Subscription = new Subscription();

  goalNotifications: any[] = [];

  allNotifications: any[] = [];


  profiledd: any[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/theme-pages/account-setting'
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'My Inbox',
      subtitle: 'Messages & Email',
      link: '/apps/chat'
    },

  ];

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private vsidenav: CoreService,

    public dialog: MatDialog,

    private chatService: ChatService,

    private notificationService:
      NotificationService,

    private router: Router

  ) {}

  // =====================================================
  // INIT
  // =====================================================


  ngOnInit(): void {

  this.chatService.startUnreadPolling();

  this.notificationService.startPolling();

  this.subs.add(

    this.chatService.unreadCount$
      .subscribe((count: number) => {

        this.unreadChatMessagesCount = count;
      })
  );

  this.subs.add(

    this.chatService.unreadSenders$
      .subscribe((senders: any[]) => {

        this.unreadSenders = senders;

        this.combineNotifications();
      })
  );

  this.subs.add(

    this.notificationService.notifications$
      .subscribe((data: any[]) => {

        this.goalNotifications = data;

        this.combineNotifications();
      })
  );
}

  // =====================================================
  // DESTROY
  // =====================================================
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  // =====================================================
  // COMBINE NOTIFICATIONS
  // =====================================================

  combineNotifications(): void {
    const chatNotifications = this.unreadSenders.map(sender => ({
    type: 'chat',
    id: sender.id,
    name: sender.name,
    count: sender.count,
    senderType: sender.type,

    // IMPORTANT
    userId:
      sender.type === 'private'
        ? sender.userId || sender.senderId || sender.id
        : null,

    groupId:
      sender.type === 'group'
        ? sender.groupId || sender.id
        : null,

    createdAt: sender.createdAt || new Date()
  }));
  const goalNotifications =
  this.goalNotifications
    .filter(notif => !notif.read)
    .map(notif => ({
      type: 'goal',
      id: notif.id,
      message: notif.message,
      createdAt: notif.createdAt,
      read: notif.read
    }));
  this.allNotifications = [
    ...goalNotifications,
    ...chatNotifications
  ].sort((a: any, b: any) => {
    const dateA =
      a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;
    const dateB =
      b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;
    return dateB - dateA;
  });
  const unreadGoals =
    this.goalNotifications.filter(
      n => !n.read
    ).length;
  const unreadChats =
    this.unreadSenders.reduce(
      (sum, sender) => sum + sender.count,
      0
    );
  this.totalNotificationsCount =
    unreadGoals + unreadChats;
}

  // =====================================================
  // MARK AS READ
  // =====================================================

  markNotificationAsRead(notif: any): void {

    // ==========================================
    // CHAT
    // ==========================================

    if (notif.type === 'chat') {

      console.log('CHAT NOTIF =>', notif);

      const queryParams: any = {};

      if (notif.senderType === 'group') {
        queryParams.groupId = notif.groupId;
      } else {
        queryParams.userId = notif.userId;
      }

      console.log('QUERY PARAMS =>', queryParams);

      this.router.navigate(
        ['/apps/chat'],
        { queryParams }
      );

      return;
    }
    // ==========================================
    // GOAL
    // ==========================================

    if (notif.type === 'goal') {

  // déjà lu
  if (notif.read) {

    this.router.navigate([
      '/apps/goals'
    ]);

    return;
  }

  this.notificationService
  .markAsRead(notif.id)
  .subscribe({

    next: () => {

      console.log('Notification marked as read');

      this.goalNotifications =
        this.goalNotifications.map(n =>
          n.id === notif.id
            ? { ...n, read: true }
            : n
        );

      this.combineNotifications();

      this.router.navigate([
        '/apps/reading-goal'
      ]);
    },

    error: (err) => {

      console.error(
        'MARK READ ERROR =>',
        err
      );
    }
  });

  return;
}
  }
  // =====================================================
  // OPEN SEARCH
  // =====================================================
  openDialog(): void {
    console.log('Search dialog opened');
  }
  getProfileImage(): string | null {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.image) {
    return `/uploads/${user.image}`;
  }

  return null;
}

getUserInitial(): string {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.username) {
    return user.username.charAt(0).toUpperCase();
  }

  return 'U';
}
}