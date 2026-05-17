import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private apiUrl = 'http://localhost:8081/api/preferences';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private getUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || '';
    } catch (e) {
      return '';
    }
  }

  getPreferences(): Observable<any> {
    const userId = this.getUserId();
    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  savePreferences(data: any): Observable<any> {
    const userId = this.getUserId();
    return this.http.put(`${this.apiUrl}/user/${userId}`, data, { headers: this.getHeaders() });
  }
}