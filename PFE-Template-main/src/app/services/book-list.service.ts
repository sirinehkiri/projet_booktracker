import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookListService {
  private apiUrl = 'http://localhost:8081/api/book-lists';

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

  initDefaultLists(): Observable<any> {
    const userId = this.getUserId();
    return this.http.post(`${this.apiUrl}/init-defaults/user/${userId}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }

  getUserLists(): Observable<any[]> {
    const userId = this.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  createList(data: { name: string; description?: string }): Observable<any> {
    const userId = this.getUserId();
    return this.http.post(`${this.apiUrl}/user/${userId}`, data, { headers: this.getHeaders() });
  }

  updateList(listId: number, data: { name: string; description?: string }): Observable<any> {
    const userId = this.getUserId();
    return this.http.put(`${this.apiUrl}/${listId}/user/${userId}`, data, { headers: this.getHeaders() });
  }

  deleteList(listId: number): Observable<any> {
    const userId = this.getUserId();
    return this.http.delete(`${this.apiUrl}/${listId}/user/${userId}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }

  addBookToList(listId: number, bookId: number): Observable<any> {
    const userId = this.getUserId();
    return this.http.post(`${this.apiUrl}/${listId}/books/${bookId}/user/${userId}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }

  removeBookFromList(listId: number, bookId: number): Observable<any> {
    const userId = this.getUserId();
    return this.http.delete(`${this.apiUrl}/${listId}/books/${bookId}/user/${userId}`, {
      headers: this.getHeaders(),
      responseType: 'text' as 'json'
    });
  }

  getBooksInList(listId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${listId}/books`, { headers: this.getHeaders() });
  }

  reorderBooks(listId: number, orderedBookIds: number[]): Observable<any> {
    const userId = this.getUserId();
    return this.http.put(
      `${this.apiUrl}/${listId}/reorder/user/${userId}`,
      orderedBookIds,
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }
}