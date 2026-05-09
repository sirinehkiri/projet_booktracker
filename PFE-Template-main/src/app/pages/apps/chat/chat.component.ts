import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class AppChatComponent implements OnInit, OnDestroy {

  sidePanelOpened = true;
  msg = '';
  searchText = '';

  contacts: any[] = [];
  groups: any[] = [];
  unreadMessages: any[] = [];
  conversation: any[] = [];

  selectedChat: {
    type: 'private' | 'group';
    data: any;
  } | null = null;

  currentUserId: number | null = null;
  currentUsername = '';

  refreshSub!: Subscription;

  // CREATE GROUP
  showCreateGroupForm = false;
  newGroupName = '';
  selectedMemberIds: number[] = [];

  // LEAVE GROUP
  showLeaveConfirm = false;
  leaveGroupTarget: any = null;

  // JOIN GROUP
  showJoinGroupPanel = false;
  availableGroups: any[] = [];
  joinSearchText = '';

  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: NgScrollbar;

  @ViewChild('myInput', { static: false })
  myInput!: ElementRef<HTMLInputElement>;

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
          this.currentUsername =
            userObj.username || userObj.name || '';
          this.currentUserId =
            this.currentUserId ||
            userObj.id ||
            userObj.userId;
        } catch (e) {}
      }
    }

    this.loadContacts();
    this.loadGroups();
    this.loadUnreadMessages();

    this.route.queryParams.subscribe((params: any) => {
      if (params['groupId']) {
        this.openGroupConversation(+params['groupId']);
      } else if (params['userId']) {
        this.openConversation(+params['userId']);
      }
    });

    this.refreshSub = interval(4000).subscribe(() => {
      this.loadContacts();
      this.loadGroups();
      this.loadUnreadMessages();
      this.reloadCurrentConversation();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  // ================= FILTERS =================

  get filteredContacts(): any[] {
    if (!this.searchText.trim()) return this.contacts;
    return this.contacts.filter((c: any) =>
      (c.username || '')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  get filteredGroups(): any[] {
    if (!this.searchText.trim()) return this.groups;
    return this.groups.filter((g: any) =>
      (g.name || '')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  get filteredAvailableGroups(): any[] {
    if (!this.joinSearchText.trim()) {
      return this.availableGroups;
    }
    return this.availableGroups.filter((g: any) =>
      (g.name || '')
        .toLowerCase()
        .includes(this.joinSearchText.toLowerCase())
    );
  }

  // ================= SCROLL =================

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTo({
          bottom: 0,
          duration: 0
        });
      }
    }, 200);
  }

  // ================= LOAD DATA =================

  loadContacts(): void {
    this.chatService.getContacts().subscribe({
      next: (data: any[]) => {
        this.contacts = data || [];
      },
      error: (err: any) =>
        console.error('Error loading contacts', err)
    });
  }

  loadGroups(): void {
    this.chatService.getGroups().subscribe({
      next: (data: any[]) => {
        this.groups = data || [];
      },
      error: (err: any) =>
        console.error('Error loading groups', err)
    });
  }

  loadUnreadMessages(): void {
    this.chatService.getUnreadMessages().subscribe({
      next: (data: any[]) => {
        this.unreadMessages = data || [];
      },
      error: (err: any) =>
        console.error('Error loading unread', err)
    });
  }

  reloadCurrentConversation(): void {
    if (!this.selectedChat) return;

    if (this.selectedChat.type === 'private') {
      this.loadConversation(this.selectedChat.data.id);
    } else {
      this.loadGroupConversation(
        this.selectedChat.data.id
      );
    }
  }

  // ================= OPEN CHAT =================

  openConversation(userId: number): void {

    const found = this.contacts.find(
      (c: any) => c.id === userId
    );

    if (found) {
      this.selectedChat = { type: 'private', data: found };
      this.loadConversation(userId);
      this.chatService
        .markAsRead(userId)
        .subscribe(() => this.loadUnreadMessages());
      return;
    }

    this.selectedChat = {
      type: 'private',
      data: { id: userId, username: 'Loading...' }
    };

    this.chatService.getUserInfo(userId).subscribe({
      next: (user: any) => {
        this.selectedChat = {
          type: 'private',
          data: user
        };
      },
      error: (err: any) =>
        console.error('Error loading user info', err)
    });

    this.loadConversation(userId);
    this.chatService
      .markAsRead(userId)
      .subscribe(() => this.loadUnreadMessages());
  }

  openGroupConversation(groupId: number): void {

    const found = this.groups.find(
      (g: any) => g.id === groupId
    );

    if (found) {
      this.selectedChat = { type: 'group', data: found };
      this.loadGroupConversation(groupId);
      this.chatService
        .markGroupAsRead(groupId)
        .subscribe(() => this.loadGroups());
      return;
    }

    this.chatService.getGroups().subscribe({
      next: (groups: any[]) => {
        this.groups = groups || [];
        const group = this.groups.find(
          (g: any) => g.id === groupId
        );
        if (group) {
          this.selectedChat = {
            type: 'group',
            data: group
          };
          this.loadGroupConversation(groupId);
          this.chatService
            .markGroupAsRead(groupId)
            .subscribe(() => this.loadGroups());
        }
      },
      error: (err: any) =>
        console.error('Error loading groups', err)
    });
  }

  loadConversation(userId: number): void {
    this.chatService.getConversation(userId).subscribe({
      next: (data: any[]) => {
        this.conversation = data || [];
        this.scrollToBottom();
      },
      error: (err: any) =>
        console.error('Error loading conversation', err)
    });
  }

  loadGroupConversation(groupId: number): void {
    this.chatService
      .getGroupConversation(groupId)
      .subscribe({
        next: (data: any[]) => {
          this.conversation = data || [];
          this.scrollToBottom();
        },
        error: (err: any) =>
          console.error(
            'Error loading group conversation',
            err
          )
      });
  }

  // ================= SELECT =================

  onSelect(contact: any): void {
    this.openConversation(contact.id);
    this.searchText = '';
  }

  onSelectGroup(group: any): void {
    this.openGroupConversation(group.id);
    this.searchText = '';
  }

  // ================= CREATE GROUP =================

  toggleMember(userId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedMemberIds.includes(userId)) {
        this.selectedMemberIds.push(userId);
      }
    } else {
      this.selectedMemberIds =
        this.selectedMemberIds.filter(
          id => id !== userId
        );
    }
  }

  createGroup(): void {

    const name = this.newGroupName.trim();
    if (!name) return;

    this.chatService
      .createGroup(name, this.selectedMemberIds)
      .subscribe({
        next: (group: any) => {
          this.newGroupName = '';
          this.selectedMemberIds = [];
          this.showCreateGroupForm = false;
          this.loadGroups();
          this.selectedChat = {
            type: 'group',
            data: group
          };
          this.loadGroupConversation(group.id);
        },
        error: (err: any) =>
          console.error('Error creating group', err)
      });
  }

  // ================= LEAVE GROUP =================

  isGroupAdmin(group: any): boolean {
    return group?.createdById === this.currentUserId;
  }

  confirmLeaveGroup(event: Event, group: any): void {
    event.stopPropagation();
    this.leaveGroupTarget = group;
    this.showLeaveConfirm = true;
  }

  cancelLeave(): void {
    this.showLeaveConfirm = false;
    this.leaveGroupTarget = null;
  }

  leaveGroup(): void {

    if (!this.leaveGroupTarget) return;

    const groupId = this.leaveGroupTarget.id;

    this.chatService.leaveGroup(groupId).subscribe({

      next: () => {

        this.groups = this.groups.filter(
          (g: any) => g.id !== groupId
        );

        if (
          this.selectedChat?.type === 'group' &&
          this.selectedChat?.data?.id === groupId
        ) {
          this.selectedChat = null;
          this.conversation = [];
        }

        this.showLeaveConfirm = false;
        this.leaveGroupTarget = null;
      },

      error: (err: any) => {
        console.error('Error leaving group', err);
        alert(
          err?.error?.message ||
          'Cannot leave this group'
        );
        this.showLeaveConfirm = false;
        this.leaveGroupTarget = null;
      }
    });
  }

  // ================= JOIN GROUP =================

  openJoinPanel(): void {
    this.showJoinGroupPanel = true;
    this.joinSearchText = '';
    this.loadAvailableGroups();
  }

  closeJoinPanel(): void {
    this.showJoinGroupPanel = false;
    this.availableGroups = [];
    this.joinSearchText = '';
  }

  loadAvailableGroups(): void {
    this.chatService.getAllGroups().subscribe({
      next: (data: any[]) => {
        this.availableGroups = data || [];
      },
      error: (err: any) =>
        console.error(
          'Error loading available groups',
          err
        )
    });
  }

  rejoinGroup(group: any): void {

    this.chatService.rejoinGroup(group.id).subscribe({

      next: () => {

        // Retire de available
        this.availableGroups =
          this.availableGroups.filter(
            (g: any) => g.id !== group.id
          );

        // Reload mes groups
        this.loadGroups();

        // Fermer si vide
        if (this.availableGroups.length === 0) {
          this.closeJoinPanel();
        }
      },

      error: (err: any) => {
        console.error('Error joining group', err);
        alert(
          err?.error?.message ||
          'Cannot join this group'
        );
      }
    });
  }

  // ================= SEND MESSAGE =================

  OnAddMsg(): void {

    const value = this.msg.trim();
    if (!value || !this.selectedChat) return;

    if (this.selectedChat.type === 'private') {

      this.chatService
        .sendMessage(this.selectedChat.data.id, value)
        .subscribe({
          next: (savedMessage: any) => {
            this.conversation.push(savedMessage);
            this.msg = '';
            if (this.myInput) {
              this.myInput.nativeElement.value = '';
            }
            this.loadContacts();
            this.loadUnreadMessages();
            this.scrollToBottom();
          },
          error: (err: any) =>
            console.error('Error sending message', err)
        });

    } else {

      this.chatService
        .sendGroupMessage(
          this.selectedChat.data.id,
          value
        )
        .subscribe({
          next: (savedMessage: any) => {
            this.conversation.push(savedMessage);
            this.msg = '';
            if (this.myInput) {
              this.myInput.nativeElement.value = '';
            }
            this.loadGroups();
            this.scrollToBottom();
          },
          error: (err: any) =>
            console.error(
              'Error sending group message',
              err
            )
        });
    }
  }

  // ================= DELETE MESSAGE =================

  deleteMessage(messageId: number): void {

    if (!this.selectedChat) return;

    const req =
      this.selectedChat.type === 'private'
        ? this.chatService.deleteMessage(messageId)
        : this.chatService.deleteGroupMessage(messageId);

    req.subscribe({
      next: () => {
        this.conversation = this.conversation.filter(
          (m: any) => m.id !== messageId
        );
        this.loadContacts();
        this.loadGroups();
        this.loadUnreadMessages();
      },
      error: (err: any) =>
        console.error('Error deleting message', err)
    });
  }

  // ================= HELPERS =================

  isOver(): boolean {
    return window.matchMedia(
      '(max-width: 960px)'
    ).matches;
  }

  isMine(message: any): boolean {

    if (!this.currentUserId && !this.currentUsername) {
      return false;
    }

    if (
      message.senderId !== undefined &&
      this.currentUserId
    ) {
      return (
        Number(message.senderId) === this.currentUserId
      );
    }

    if (
      message.sender?.id !== undefined &&
      this.currentUserId
    ) {
      return (
        Number(message.sender.id) === this.currentUserId
      );
    }

    if (message.senderName && this.currentUsername) {
      return message.senderName === this.currentUsername;
    }

    if (
      message.sender?.username &&
      this.currentUsername
    ) {
      return (
        message.sender.username === this.currentUsername
      );
    }

    return false;
  }

  getSenderName(message: any): string {
    if (message.senderName) return message.senderName;
    if (message.sender?.username) {
      return message.sender.username;
    }
    if (message.sender?.name) {
      return message.sender.name;
    }
    return 'Unknown';
  }

  getUnreadCount(contactId: number): number {
    return this.unreadMessages.filter((m: any) => {
      let senderId: number | null = null;
      if (m.senderId !== undefined) {
        senderId = Number(m.senderId);
      } else if (m.sender?.id !== undefined) {
        senderId = Number(m.sender.id);
      }
      return senderId === contactId;
    }).length;
  }

  getSelectedTitle(): string {
    if (!this.selectedChat) return '';
    return this.selectedChat.type === 'group'
      ? this.selectedChat.data.name
      : this.selectedChat.data.username;
  }

  getMemberColor(username: string): string {

    const colors = [
      'linear-gradient(135deg, #7b1fa2, #9c27b0)',
      'linear-gradient(135deg, #1976d2, #42a5f5)',
      'linear-gradient(135deg, #00897b, #26a69a)',
      'linear-gradient(135deg, #ef6c00, #ffa726)',
      'linear-gradient(135deg, #c62828, #ef5350)',
      'linear-gradient(135deg, #5e35b1, #7e57c2)',
      'linear-gradient(135deg, #2e7d32, #66bb6a)',
      'linear-gradient(135deg, #6d4c41, #8d6e63)',
      'linear-gradient(135deg, #ad1457, #ec407a)',
      'linear-gradient(135deg, #283593, #5c6bc0)'
    ];

    let hash = 0;

    for (let i = 0; i < username.length; i++) {
      hash =
        username.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return colors[Math.abs(hash % colors.length)];
  }
}