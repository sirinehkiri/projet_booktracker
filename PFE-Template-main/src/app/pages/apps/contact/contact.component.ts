import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocialService } from './social.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './contact.component.html',
})
export class AppContactComponent implements OnInit {
  contacts: any[] = [];
  allContacts: any[] = [];
  requests: any[] = [];
  sentRequests: any[] = [];
  notifications: any[] = [];

  constructor(
    public dialog: MatDialog,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadRequests();
    this.loadSentRequests();
    this.loadNotifications();
  }

  // =====================================================
  // LOAD CONTACTS + FLOWS
  // =====================================================

  loadContacts(): void {
    this.socialService.getContacts().subscribe({
      next: (data: any[]) => {
        this.allContacts = data;
        this.contacts = data;

        this.contacts.forEach((contact: any) => {
          this.loadUserFlows(contact);
        });
      },
      error: (err: any) => {
        console.error('Error contacts', err);
      }
    });
  }

  // =====================================================
  // LOAD FLOWS COUNT
  // =====================================================

  loadUserFlows(contact: any): void {
    this.socialService.getUserFlowsCount(contact.id).subscribe({
      next: (flows: any) => {
        contact.followersCount = flows.followers || 0;
        contact.followingCount = flows.following || 0;
        contact.totalFlows = flows.total || 0;
      },
      error: () => {
        contact.followersCount = 0;
        contact.followingCount = 0;
        contact.totalFlows = 0;
      }
    });
  }

  // =====================================================
  // LOAD REQUESTS RECEIVED
  // =====================================================

  loadRequests(): void {
    this.socialService.getRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data;
      },
      error: (err: any) => {
        console.error('Error requests', err);
      }
    });
  }

  // =====================================================
  // LOAD SENT REQUESTS
  // =====================================================

  loadSentRequests(): void {
    this.socialService.getSentRequests().subscribe({
      next: (data: any[]) => {
        this.sentRequests = data;
      },
      error: (err: any) => {
        console.error('Error sent requests', err);
      }
    });
  }

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {
    this.socialService.getNotifications().subscribe({
      next: (data: any[]) => {
        this.notifications = data;
      },
      error: (err: any) => {
        console.error('Error notifications', err);
      }
    });
  }

  // =====================================================
  // OPEN DIALOG
  // =====================================================

  openDialog(): void {
    const dialogRef = this.dialog.open(
      AppContactDialogContentComponent,
      {
        width: '650px'
      }
    );

    dialogRef.afterClosed().subscribe((changed: boolean) => {
      if (changed) {
        this.loadContacts();
        this.loadRequests();
        this.loadSentRequests();
        this.loadNotifications();
      }
    });
  }

  // =====================================================
  // FILTER CONTACTS
  // =====================================================

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement)
      .value
      .toLowerCase();

    this.contacts = this.allContacts.filter((x: any) =>
      x.username?.toLowerCase().includes(filterValue)
    );
  }

  // =====================================================
  // ACCEPT REQUEST
  // =====================================================

  acceptRequest(id: number): void {
    this.socialService.acceptRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(
          (req: any) => req.id !== id
        );

        this.loadContacts();
        this.loadNotifications();
        this.loadSentRequests();
      },
      error: (err: any) => {
        console.error('Error accept', err);
      }
    });
  }

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  rejectRequest(id: number): void {
    this.socialService.rejectRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(
          (req: any) => req.id !== id
        );

        this.loadNotifications();
        this.loadSentRequests();
      },
      error: (err: any) => {
        console.error('Error reject', err);
      }
    });
  }

  // =====================================================
  // IMAGE / INITIAL
  // =====================================================

  getContactImage(contact: any): string | null {
    if (contact?.image) {
      return `/uploads/${contact.image}`;
    }

    return null;
  }

  getContactInitial(contact: any): string {
    return contact?.username
      ? contact.username.charAt(0).toUpperCase()
      : 'U';
  }
}

// =====================================================
// DIALOG COMPONENT
// =====================================================

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
export class AppContactDialogContentComponent implements OnInit {
  users: any[] = [];
  searchText: string = '';
  changed: boolean = false;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    private socialService: SocialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // =====================================================
  // FILTERED USERS
  // =====================================================

  get filteredUsers(): any[] {
    if (!this.searchText.trim()) {
      return this.users;
    }

    const value = this.searchText.toLowerCase();

    return this.users.filter((u: any) =>
      u.username?.toLowerCase().includes(value) ||
      u.email?.toLowerCase().includes(value)
    );
  }

  // =====================================================
  // ADD ID SAFELY
  // =====================================================

  private addIdToSet(set: Set<number>, value: any): void {
    const id = Number(value);

    if (id > 0 && !Number.isNaN(id)) {
      set.add(id);
    }
  }

  // =====================================================
  // LOAD USERS BUT EXCLUDE:
  // - current user
  // - existing contacts/friends
  // - sent requests
  // - received requests
  // =====================================================

  loadUsers(): void {
    this.loading = true;

    forkJoin({
      users: this.socialService.getUsers(),
      contacts: this.socialService.getContacts(),
      sentRequests: this.socialService.getSentRequests(),
      receivedRequests: this.socialService.getRequests()
    }).subscribe({
      next: ({
        users,
        contacts,
        sentRequests,
        receivedRequests
      }) => {
        const excludedIds = new Set<number>();

        // current user
        const currentUserId = Number(localStorage.getItem('userId'));
        this.addIdToSet(excludedIds, currentUserId);

        // existing contacts/friends
        contacts.forEach((contact: any) => {
          this.addIdToSet(excludedIds, contact.id);
        });

        // users you already sent request to
        sentRequests.forEach((req: any) => {
          this.addIdToSet(
            excludedIds,
            req.receiver?.id ?? req.receiverId
          );
        });

        // users who already sent you request
        receivedRequests.forEach((req: any) => {
          this.addIdToSet(
            excludedIds,
            req.sender?.id ?? req.senderId
          );
        });

        // keep only users not excluded
        this.users = users
          .filter((user: any) => !excludedIds.has(Number(user.id)))
          .map((user: any) => ({
            ...user,
            requestSent: false
          }));

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error users', err);
        this.loading = false;
      }
    });
  }

  // =====================================================
  // MESSAGE USER
  // =====================================================

  messageUser(user: any): void {
    this.dialogRef.close(this.changed);

    this.router.navigate(
      ['/apps/chat'],
      {
        queryParams: {
          userId: user.id
        }
      }
    );
  }

  // =====================================================
  // ADD FRIEND / SEND FOLLOW REQUEST
  // =====================================================

  addFriend(user: any): void {
    user.requestSent = true;

    this.socialService.sendFollowRequest(user.id).subscribe({
      next: () => {
        this.changed = true;

        // remove from list after sending request
        this.users = this.users.filter((u: any) => u.id !== user.id);
      },
      error: (err: any) => {
        user.requestSent = false;
        console.error('Error sending request', err);
      }
    });
  }

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  closeDialog(): void {
    this.dialogRef.close(this.changed);
  }

  // =====================================================
  // IMAGE / INITIAL
  // =====================================================

  getContactImage(user: any): string | null {
    if (user?.image) {
      return `/uploads/${user.image}`;
    }

    return null;
  }

  getContactInitial(user: any): string {
    return user?.username
      ? user.username.charAt(0).toUpperCase()
      : 'U';
  }
}