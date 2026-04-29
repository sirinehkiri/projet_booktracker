import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class AppChatComponent implements OnInit, OnDestroy {
  sidePanelOpened = true;
  msg = '';

  contacts: any[] = [];
  selectedContact: any = null;
  conversation: any[] = [];
  unreadMessages: any[] = [];
  currentUserId: number | null = null;
  refreshSub!: Subscription;

  @ViewChild('myInput', { static: true }) myInput!: ElementRef;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? +userId : null;

    this.loadContacts();
    this.loadUnreadMessages();

    this.route.queryParams.subscribe((params: any) => {
      const contactId = params['userId'];
      if (contactId) {
        this.openConversation(+contactId);
      }
    });

    this.refreshSub = interval(3000).subscribe(() => {
      this.loadUnreadMessages();
      this.loadContacts();

      if (this.selectedContact) {
        this.loadConversation(this.selectedContact.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadContacts(): void {
    this.chatService.getContacts().subscribe({
      next: (data: any[]) => {
        this.contacts = data;

        if (!this.selectedContact && this.contacts.length > 0) {
          this.selectedContact = this.contacts[0];
          this.loadConversation(this.selectedContact.id);
        }
      },
      error: (err: any) => {
        console.error('Erreur contacts chat', err);
      }
    });
  }

  loadUnreadMessages(): void {
    this.chatService.getUnreadMessages().subscribe({
      next: (data: any[]) => {
        this.unreadMessages = data;
      },
      error: (err: any) => {
        console.error('Erreur unread messages', err);
      }
    });
  }

  openConversation(userId: number): void {
    const found = this.contacts.find((c: any) => c.id === userId);

    if (found) {
      this.selectedContact = found;
      this.loadConversation(userId);
    }
  }

  loadConversation(userId: number): void {
    this.chatService.getConversation(userId).subscribe({
      next: (data: any[]) => {
        this.conversation = data;
      },
      error: (err: any) => {
        console.error('Erreur conversation', err);
      }
    });
  }

  isOver(): boolean {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  onSelect(contact: any): void {
    this.selectedContact = contact;
    this.loadConversation(contact.id);
  }

  OnAddMsg(): void {
    const value = this.myInput.nativeElement.value?.trim();

    if (!value || !this.selectedContact) {
      return;
    }

    this.chatService.sendMessage(this.selectedContact.id, value).subscribe({
      next: (savedMessage: any) => {
        this.conversation.push(savedMessage);
        this.msg = '';
        this.myInput.nativeElement.value = '';
        this.loadContacts();
        this.loadUnreadMessages();
      },
      error: (err: any) => {
        console.error('Erreur envoi message', err);
      }
    });
  }

  isMine(message: any): boolean {
    return this.currentUserId === message.senderId;
  }

  getUnreadCount(contactId: number): number {
    return this.unreadMessages.filter((m: any) => m.senderId === contactId).length;
  }
}