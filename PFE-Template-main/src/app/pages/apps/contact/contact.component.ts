import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocialService } from './social.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router } from '@angular/router';

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

        // ✅ Load flows lkol contact
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
  // ✅ LOAD FLOWS COUNT
  // =====================================================

  loadUserFlows(contact: any): void {
    this.socialService
      .getUserFlowsCount(contact.id)
      .subscribe({
        next: (flows: any) => {
          contact.followersCount =
            flows.followers || 0;
          contact.followingCount =
            flows.following || 0;
          contact.totalFlows =
            flows.total || 0;
        },
        error: () => {
          contact.followersCount = 0;
          contact.followingCount = 0;
          contact.totalFlows = 0;
        }
      });
  }

  // =====================================================
  // LOAD REQUESTS
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
      { width: '600px' }
    );

    dialogRef.afterClosed().subscribe(
      (selectedUser: any) => {
        if (selectedUser) {
          this.followUser(selectedUser.id);
        }
      }
    );
  }

  // =====================================================
  // FILTER
  // =====================================================

  applyFilter(event: Event): void {
    const filterValue =
      (event.target as HTMLInputElement)
        .value.toLowerCase();
    this.contacts = this.allContacts.filter(
      (x: any) =>
        x.username?.toLowerCase()
          .includes(filterValue)
    );
  }

  // =====================================================
  // FOLLOW USER
  // =====================================================

  followUser(userId: number): void {
    this.socialService
      .sendFollowRequest(userId)
      .subscribe({
        next: () => {
          this.loadSentRequests();
          this.loadNotifications();
        },
        error: (err: any) => {
          console.error('Error follow', err);
        }
      });
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
}

// =====================================================
// DIALOG COMPONENT
// =====================================================

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
export class AppContactDialogContentComponent
  implements OnInit {

  users: any[] = [];
  searchText: string = '';

  constructor(
    public dialogRef: MatDialogRef<
      AppContactDialogContentComponent
    >,
    private socialService: SocialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  get filteredUsers(): any[] {
    if (!this.searchText.trim()) {
      return this.users;
    }
    return this.users.filter(
      (u: any) =>
        u.username.toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        u.email.toLowerCase()
          .includes(this.searchText.toLowerCase())
    );
  }

  loadUsers(): void {
    this.socialService.getUsers().subscribe({
      next: (data: any[]) => {
        const currentUserId =
          +localStorage.getItem('userId')!;
        this.users = data
          .filter(u => u.id !== currentUserId)
          .map(u => ({
            ...u,
            requestSent: false
          }));
      },
      error: (err: any) => {
        console.error('Error users', err);
      }
    });
  }

  messageUser(user: any): void {
    this.dialogRef.close();
    this.router.navigate(
      ['/apps/chat'],
      { queryParams: { userId: user.id } }
    );
  }

  addFriend(user: any): void {
    this.socialService
      .sendFollowRequest(user.id)
      .subscribe({
        next: () => {
          user.requestSent = true;
        },
        error: (err: any) => {
          console.error(
            'Error sending request',
            err
          );
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}