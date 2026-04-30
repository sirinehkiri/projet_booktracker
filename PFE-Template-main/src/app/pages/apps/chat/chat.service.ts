import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8081/api/chat';

  // Compteur de messages non lus
  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$: Observable<number> = this.unreadCountSubject.asObservable();

  // Liste des expéditeurs
  private unreadSendersSubject = new BehaviorSubject<any[]>([]);
  unreadSenders$: Observable<any[]> = this.unreadSendersSubject.asObservable();

  // ID utilisateur courant
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) {
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? +userId : null;
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================================
  // DÉMARRER LE POLLING (appelé par le header)
  // ============================================
  startUnreadPolling(): void {
    // Vérifier immédiatement
    this.fetchUnreadCount();

    // Puis toutes les 3 secondes
    interval(3000).subscribe(() => {
      this.fetchUnreadCount();
    });
  }

  // ============================================
  // RÉCUPÉRER LE NOMBRE DE MESSAGES NON LUS
  // ============================================
  fetchUnreadCount(): void {
    this.http.get<any[]>(`${this.apiUrl}/unread`, { headers: this.getHeaders() })
      .subscribe({
        next: (data: any[]) => {
          // Mettre à jour le compteur
          this.unreadCountSubject.next(data.length);

          // Calculer les expéditeurs uniques
          const senderMap = new Map<number, any>();
          data.forEach((msg: any) => {
            let senderId: number | null = null;
            let senderName: string = 'Unknown';

            if (msg.senderId) {
              senderId = Number(msg.senderId);
            } else if (msg.sender && msg.sender.id) {
              senderId = Number(msg.sender.id);
            }

            if (msg.senderName) {
              senderName = msg.senderName;
            } else if (msg.sender && msg.sender.username) {
              senderName = msg.sender.username;
            }

            if (senderId) {
              if (senderMap.has(senderId)) {
                senderMap.get(senderId).count++;
              } else {
                senderMap.set(senderId, {
                  id: senderId,
                  name: senderName,
                  count: 1
                });
              }
            }
          });

          this.unreadSendersSubject.next(Array.from(senderMap.values()));
        },
        error: (err: any) => {
          console.error('Error fetching unread:', err);
        }
      });
  }

  // ============================================
  // MARK AS READ
  // ============================================
  markAsRead(senderId: number): void {
    this.http.post(`${this.apiUrl}/markAsRead/${senderId}`, {}, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          // Rafraîchir immédiatement le compteur
          this.fetchUnreadCount();
        },
        error: (err: any) => {
          console.error('Error marking as read:', err);
        }
      });
  }

  // ============================================
  // MÉTHODES EXISTANTES
  // ============================================
  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`, { headers: this.getHeaders() });
  }

  getConversation(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversation/${userId}`, { headers: this.getHeaders() });
  }

  sendMessage(receiverId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { receiverId, content }, { headers: this.getHeaders() });
  }

  getUnreadMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unread`, { headers: this.getHeaders() });
  }
  deleteMessage(messageId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${messageId}`, { headers: this.getHeaders() });
}
}