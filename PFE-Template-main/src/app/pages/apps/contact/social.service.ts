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

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  getContacts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contacts`, { headers: this.getHeaders() });
  }

  sendFollowRequest(receiverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/follow`, { receiverId }, { headers: this.getHeaders() });
  }

  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/requests`, { headers: this.getHeaders() });
  }

  getSentRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sent-requests`, { headers: this.getHeaders() });
  }

  acceptRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${id}/accept`, {}, { headers: this.getHeaders() });
  }

  rejectRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/requests/${id}/reject`, {}, { headers: this.getHeaders() });
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`, { headers: this.getHeaders() });
  }
}