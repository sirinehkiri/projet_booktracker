import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:8081/api/chat';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

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
}