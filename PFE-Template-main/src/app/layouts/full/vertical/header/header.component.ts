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

  // =====================================================
  // GOAL NOTIFICATIONS
  // =====================================================

  goalNotifications: any[] = [];

  // =====================================================
  // ALL NOTIFICATIONS
  // =====================================================

  allNotifications: any[] = [];

  // =====================================================
  // SUBSCRIPTIONS
  // =====================================================

  // =====================================================
  // PROFILE MENU
  // =====================================================

  profiledd: any[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/'
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'My Inbox',
      subtitle: 'Messages & Email',
      link: '/apps/email/inbox'
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-tasks.svg',
      title: 'My Tasks',
      subtitle: 'To-do and Daily Tasks',
      link: '/apps/taskboard'
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

  // =====================================================
  // LIFECYCLE
  // =====================================================

  ngOnInit(): void {

    // Start polling
    this.chatService.startUnreadPolling();

    // Subscribe unread count
    this.subs.add(
      this.chatService.unreadCount$.subscribe(
        (count: number) => {
          this.unreadChatMessagesCount = count;
        }
      )
    );

    // Subscribe unread senders
    this.subs.add(
      this.chatService.unreadSenders$.subscribe(
        (senders: any[]) => {
          this.unreadSenders = senders;
        }
      )
    );

  this.chatService.startUnreadPolling();
   this.notificationService.startPolling();

  this.subs.add(

    this.chatService.unreadCount$
      .subscribe((count: number) => {

        this.unreadChatMessagesCount =
          count;
      })
  );

  this.subs.add(

    this.chatService.unreadSenders$
      .subscribe((senders: any[]) => {

        this.unreadSenders =
          senders;

        this.combineNotifications();
      })
  );

  this.subs.add(

    this.notificationService.notifications$
      .subscribe((data: any[]) => {

        this.goalNotifications =
          data;

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
  // METHODS
  // =====================================================
  // COMBINE NOTIFICATIONS
  // =====================================================

  combineNotifications(): void {

  const chatNotifications =

    this.unreadSenders.map(sender => ({

      type: 'chat',

      id: sender.id,

      name: sender.name,

      count: sender.count,

      senderType: sender.type,

      createdAt:
        sender.createdAt || new Date()
    }));


  const goalNotifications =

    this.goalNotifications.map(notif => ({

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

  // ✅ UPDATE BADGE
  const unreadGoals =
    this.goalNotifications.filter(
      n => !n.read
    ).length;

  this.totalNotificationsCount =
    this.unreadSenders.length + unreadGoals;
}

  // =====================================================
  // TOTAL NOTIFICATIONS
  // =====================================================

  get totalNotifications(): number {

    const unreadGoals =

      this.goalNotifications
        .filter(n => !n.read)
        .length;

    return (
      this.unreadChatMessagesCount
      + unreadGoals
    );
  }

  // =====================================================
  // MARK AS READ
  // =====================================================

  markNotificationAsRead(notif: any): void {

    // ==========================================
    // CHAT
    // ==========================================

    if (notif.type === 'chat') {

      this.router.navigate(['/apps/chat']);

      return;
    }

    // ==========================================
    // GOAL
    // ==========================================

    if (
      notif.type === 'goal'
      && !notif.read
    ) {

      this.notificationService
        .markAsRead(notif.id)
        .subscribe({

          next: () => {

            this.goalNotifications =

              this.goalNotifications.map(n =>

                n.id === notif.id

                  ? {
                      ...n,
                      read: true
                    }

                  : n
              );

            this.combineNotifications();

            this.router.navigate([
              '/apps/goals'
            ]);
          },

          error: (err) => {

            console.error(
              'Error marking notification as read',
              err
            );
          }
        });
    }
  }

  // =====================================================
  // TRACK BY
  // =====================================================

  trackByNotif(
    index: number,
    item: any
  ): number {

    return item.id;
  }

  // =====================================================
  // OPEN SEARCH
  // =====================================================

  openDialog(): void {

    console.log('Search dialog opened');
  }
}