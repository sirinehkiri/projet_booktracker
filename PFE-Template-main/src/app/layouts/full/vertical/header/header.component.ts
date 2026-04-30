import { Component, Output, EventEmitter, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChatService } from '../../../../pages/apps/chat/chat.service';
import { Subscription } from 'rxjs';

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
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  unreadChatMessagesCount: number = 0;
  unreadSenders: any[] = [];
  private subs: Subscription = new Subscription();

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    { language: 'English', code: 'en', type: 'US', icon: '/assets/images/flag/icon-flag-en.svg' },
    { language: 'Español', code: 'es', icon: '/assets/images/flag/icon-flag-es.svg' },
    { language: 'Français', code: 'fr', icon: '/assets/images/flag/icon-flag-fr.svg' },
    { language: 'German', code: 'de', icon: '/assets/images/flag/icon-flag-de.svg' },
  ];

  constructor(
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private chatService: ChatService
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // Démarrer le polling des notifications
    this.chatService.startUnreadPolling();

    // S'abonner au compteur
    this.subs.add(
      this.chatService.unreadCount$.subscribe((count: number) => {
        this.unreadChatMessagesCount = count;
      })
    );

    // S'abonner aux expéditeurs
    this.subs.add(
      this.chatService.unreadSenders$.subscribe((senders: any[]) => {
        this.unreadSenders = senders;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openDialog() {}

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  profiledd: any[] = [
    { id: 1, img: '/assets/images/svgs/icon-account.svg', title: 'My Profile', subtitle: 'Account Settings', link: '/' },
    { id: 2, img: '/assets/images/svgs/icon-inbox.svg', title: 'My Inbox', subtitle: 'Messages & Email', link: '/apps/email/inbox' },
    { id: 3, img: '/assets/images/svgs/icon-tasks.svg', title: 'My Tasks', subtitle: 'To-do and Daily Tasks', link: '/apps/taskboard' },
  ];
}