import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SocialService } from './social.service';
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
  private socialService: SocialService,
  private router: Router
) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadRequests();
    this.loadSentRequests();
    this.loadNotifications();
  }

  loadContacts(): void {
    this.socialService.getContacts().subscribe({
      next: (data: any[]) => {
        this.contacts = data;
        this.allContacts = data;
      },
      error: (err: any) => {
        console.error('Erreur contacts', err);
      }
    });
  }

  loadRequests(): void {
    this.socialService.getRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data;
      },
      error: (err: any) => {
        console.error('Erreur requests', err);
      }
    });
  }

  loadSentRequests(): void {
    this.socialService.getSentRequests().subscribe({
      next: (data: any[]) => {
        this.sentRequests = data;
      },
      error: (err: any) => {
        console.error('Erreur sent requests', err);
      }
    });
  }
  goToChat(userId: number): void {
  this.router.navigate(['/apps/chat'], { queryParams: { userId } });
}
   
  loadNotifications(): void {
    this.socialService.getNotifications().subscribe({
      next: (data: any[]) => {
        this.notifications = data;
      },
      error: (err: any) => {
        console.error('Erreur notifications', err);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppContactDialogContentComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((selectedUser: any) => {
      if (selectedUser) {
        this.followUser(selectedUser.id);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.contacts = this.allContacts.filter(
      (x: any) => x.username?.toLowerCase().includes(filterValue)
    );
  }

  followUser(userId: number): void {
    this.socialService.sendFollowRequest(userId).subscribe({
      next: () => {
        this.loadSentRequests();
        this.loadNotifications();
      },
      error: (err: any) => {
        console.error('Erreur follow', err);
      }
    });
  }

  acceptRequest(id: number): void {
    this.socialService.acceptRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter((req: any) => req.id !== id);
        this.loadContacts();
        this.loadNotifications();
        this.loadSentRequests();
      },
      error: (err: any) => {
        console.error('Erreur accept', err);
      }
    });
  }

  rejectRequest(id: number): void {
    this.socialService.rejectRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter((req: any) => req.id !== id);
        this.loadNotifications();
        this.loadSentRequests();
      },
      error: (err: any) => {
        console.error('Erreur reject', err);
      }
    });
  }
}

@Component({
  selector: 'app-dialog-content',
  templateUrl: 'contact-dialog-content.html',
})
export class AppContactDialogContentComponent implements OnInit {
  users: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppContactDialogContentComponent>,
    private socialService: SocialService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.socialService.getUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (err: any) => {
        console.error('Erreur users', err);
      }
    });
  }

  selectUser(user: any): void {
    this.dialogRef.close(user);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}