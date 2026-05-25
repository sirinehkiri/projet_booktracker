import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, interval } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  
  private apiUrl = 'http://localhost:8081/api/chat';

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  private unreadSendersSubject = new BehaviorSubject<any[]>([]);
  unreadSenders$ = this.unreadSendersSubject.asObservable();

  private pollingStarted = false;
  private pollingSub?: Subscription;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  startUnreadPolling(): void {
    if (this.pollingStarted) return;
    this.pollingStarted = true;

    this.fetchUnreadCount();
    this.pollingSub = interval(3000).subscribe(
      () => this.fetchUnreadCount()
    );
  }

  stopUnreadPolling(): void {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;
    this.pollingStarted = false;
  }

  fetchUnreadCount(): void {
    this.getUnreadMessages().subscribe({
      next: (privateMessages: any[]) => {
        this.getGroups().subscribe({
          next: (groups: any[]) => {
            const groupUnread = groups.reduce(
              (sum: number, g: any) => sum + (g.unreadCount || 0),
              0
            );

            this.unreadCountSubject.next(
              privateMessages.length + groupUnread
            );

            const senderMap = new Map<number, any>();

            privateMessages.forEach((msg: any) => {
              const senderId = msg.senderId ?? msg.sender?.id;
              const senderName = msg.senderName ?? msg.sender?.username ?? 'Unknown';

              if (senderId != null) {
                const id = Number(senderId);
                if (senderMap.has(id)) {
                  senderMap.get(id).count++;
                } else {
                  senderMap.set(id, {
                    id,
                    name: senderName,
                    count: 1,
                    type: 'private'
                  });
                }
              }
            });

            groups.forEach((group: any) => {
              if ((group.unreadCount || 0) > 0) {
                senderMap.set(100000 + group.id, {
                  id: group.id,
                  name: group.name,
                  count: group.unreadCount,
                  type: 'group'
                });
              }
            });

            this.unreadSendersSubject.next(Array.from(senderMap.values()));
          },
          error: (err: any) =>
            console.error('Error fetching groups:', err),
        });
      },
      error: (err: any) =>
        console.error('Error fetching unread messages:', err),
    });
  }

  // ================= PRIVATE =================

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/contacts`,
      { headers: this.getHeaders() }
    );
  }

  getConversation(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/conversation/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  sendMessage(receiverId: number, content: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/send`,
      { receiverId, content },
      { headers: this.getHeaders() }
    );
  }

  getUnreadMessages(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/unread`,
      { headers: this.getHeaders() }
    );
  }

  markAsRead(otherUserId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/markAsRead/${otherUserId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/delete/${messageId}`,
      { headers: this.getHeaders() }
    );
  }

  getUserInfo(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/user/${userId}`,
      { headers: this.getHeaders() }
    );
  }

  // ================= GROUPS =================

  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/groups`,
      { headers: this.getHeaders() }
    );
  }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/groups/all`,
      { headers: this.getHeaders() }
    );
  }

  createGroup(name: string, memberIds: number[]): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/groups`,
      { name, memberIds },
      { headers: this.getHeaders() }
    );
  }

  getGroupConversation(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/groups/${groupId}/conversation`,
      { headers: this.getHeaders() }
    );
  }

  sendGroupMessage(groupId: number, content: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/groups/${groupId}/send`,
      { content },
      { headers: this.getHeaders() }
    );
  }

  markGroupAsRead(groupId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/groups/${groupId}/markAsRead`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteGroupMessage(messageId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/groups/delete/${messageId}`,
      { headers: this.getHeaders() }
    );
  }

  leaveGroup(groupId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/groups/${groupId}/leave`,
      { headers: this.getHeaders() }
    );
  }

  rejoinGroup(groupId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/groups/${groupId}/join`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // ================= USERS FROM DB =================

  searchUsers(q: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
      params: { q }
    });
  }

  // ================= ADD MEMBER TO GROUP =================

  addMemberToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/groups/${groupId}/add-member/${userId}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // ✅ GET MY FRIENDS (ACCEPTED follow requests)
  // =====================================================

  getFriends(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/friends`,
      { headers: this.getHeaders() }
    );
  }
}