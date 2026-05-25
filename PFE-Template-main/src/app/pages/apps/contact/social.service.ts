import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private apiUrl = 'http://localhost:8081/api/social';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // =====================================================
  // GET USERS
  // =====================================================

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/users`,
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // GET CONTACTS
  // =====================================================

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/contacts`,
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // SEND FOLLOW REQUEST
  // =====================================================

  sendFollowRequest(receiverId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/follow`,
      { receiverId },
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // GET REQUESTS RECEIVED
  // =====================================================

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/requests`,
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // GET SENT REQUESTS
  // =====================================================

  getSentRequests(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/sent-requests`,
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // ACCEPT REQUEST
  // =====================================================

  acceptRequest(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/requests/${id}/accept`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // REJECT REQUEST
  // =====================================================

  rejectRequest(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/requests/${id}/reject`,
      {},
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // GET NOTIFICATIONS
  // =====================================================

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/notifications`,
      { headers: this.getHeaders() }
    );
  }

  // =====================================================
  // GET FLOWS COUNT
  // =====================================================

  getUserFlowsCount(userId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/users/${userId}/flows`,
      { headers: this.getHeaders() }
    );
  }
}