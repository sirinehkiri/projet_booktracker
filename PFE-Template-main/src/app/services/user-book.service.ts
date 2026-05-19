import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBook } from '../pages/apps/ticketlist/ticket';

@Injectable({
  providedIn: 'root',
})
export class UserBookService {

  private apiUrl =
    'http://localhost:8081/api/userbooks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserBooks(
    userId: number
  ): Observable<UserBook[]> {

    return this.http.get<UserBook[]>(
      `${this.apiUrl}/${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  updateStatus(
    bookId: number,
    status: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/status?bookId=${bookId}&status=${status}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteBook(id: number): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}