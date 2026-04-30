import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from './chat.service';
import { NgScrollbar } from 'ngx-scrollbar';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class AppChatComponent implements OnInit, OnDestroy {
  sidePanelOpened = true;
  msg = '';
  searchText: string = '';

  contacts: any[] = [];
  selectedContact: any = null;
  conversation: any[] = [];
  unreadMessages: any[] = [];
  currentUserId: number | null = null;
  currentUsername: string = '';

  refreshSub!: Subscription;

  @ViewChild('myInput', { static: true }) myInput!: ElementRef;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: NgScrollbar;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    this.currentUserId = userId ? +userId : null;
    this.currentUsername = username || '';

    if (!this.currentUsername) {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userObj = JSON.parse(user);
          this.currentUsername = userObj.username || userObj.name || '';
          this.currentUserId = this.currentUserId || userObj.id || userObj.userId;
        } catch (e) {}
      }
    }

    this.chatService.startUnreadPolling();

    this.loadContacts();
    this.loadUnreadMessages();

    this.route.queryParams.subscribe((params: any) => {
      const contactId = params['userId'];
      if (contactId) {
        this.openConversation(+contactId);
      }
    });

    this.refreshSub = interval(3000).subscribe(() => {
      this.loadContacts();
      this.loadUnreadMessages();

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

  // ============================================
  // FILTRE DES CONTACTS
  // ============================================
  get filteredContacts(): any[] {
    if (!this.searchText.trim()) {
      return this.contacts;
    }
    return this.contacts.filter((c: any) =>
      c.username.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ============================================
  // SCROLL
  // ============================================
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTo({ bottom: 0, duration: 0 });
      }
    }, 100);

    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTo({ bottom: 0, duration: 0 });
      }
    }, 500);

    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTo({ bottom: 0, duration: 0 });
      }
    }, 1500);
  }

  // ============================================
  // CHARGEMENT DES DONNÉES
  // ============================================
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
        console.error('Error loading contacts', err);
      }
    });
  }

  loadUnreadMessages(): void {
    this.chatService.getUnreadMessages().subscribe({
      next: (data: any[]) => {
        this.unreadMessages = data;
      },
      error: (err: any) => {
        console.error('Error loading unread messages', err);
      }
    });
  }

  openConversation(userId: number): void {
    const found = this.contacts.find((c: any) => c.id === userId);
    if (found) {
      this.selectedContact = found;
      this.loadConversation(userId);
      this.chatService.markAsRead(userId);
    }
  }

  loadConversation(userId: number): void {
    this.chatService.getConversation(userId).subscribe({
      next: (data: any[]) => {
        this.conversation = data;
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Error loading conversation', err);
      }
    });
  }

  isOver(): boolean {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  onSelect(contact: any): void {
    this.selectedContact = contact;
    this.loadConversation(contact.id);
    this.chatService.markAsRead(contact.id);
    this.searchText = '';
  }

  // ============================================
  // ENVOYER UN MESSAGE
  // ============================================
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
        this.scrollToBottom();
      },
      error: (err: any) => {
        console.error('Error sending message', err);
      }
    });
  }

  // ============================================
  // SUPPRIMER UN MESSAGE
  // ============================================
  deleteMessage(messageId: number): void {
    this.chatService.deleteMessage(messageId).subscribe({
      next: () => {
        this.conversation = this.conversation.filter((m: any) => m.id !== messageId);
        this.loadContacts();
        this.loadUnreadMessages();
      },
      error: (err: any) => {
        console.error('Error deleting message', err);
      }
    });
  }

  // ============================================
  // HELPERS
  // ============================================
  isMine(message: any): boolean {
    if (!this.currentUserId && !this.currentUsername) return false;

    if (message.senderId !== undefined && this.currentUserId) {
      return Number(message.senderId) === this.currentUserId;
    }
    if (message.sender && message.sender.id !== undefined && this.currentUserId) {
      return Number(message.sender.id) === this.currentUserId;
    }
    if (message.senderName && this.currentUsername) {
      return message.senderName === this.currentUsername;
    }
    if (message.sender && message.sender.username && this.currentUsername) {
      return message.sender.username === this.currentUsername;
    }
    return false;
  }

  getSenderName(message: any): string {
    if (message.senderName) return message.senderName;
    if (message.sender && message.sender.username) return message.sender.username;
    if (message.sender && message.sender.name) return message.sender.name;
    return 'Unknown';
  }

  getUnreadCount(contactId: number): number {
    return this.unreadMessages.filter((m: any) => {
      let senderId: number | null = null;
      if (m.senderId) senderId = Number(m.senderId);
      else if (m.sender && m.sender.id) senderId = Number(m.sender.id);
      return senderId === contactId;
    }).length;
  }
}