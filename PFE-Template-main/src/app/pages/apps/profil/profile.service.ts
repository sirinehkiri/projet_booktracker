import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl =
    'http://localhost:8081/api/profile';

  private booksApiUrl =
    'http://localhost:8081/books';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // =====================================================
  // GET PROFILE
  // =====================================================

  getProfile(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(
      `${this.apiUrl}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // =====================================================
  // ✅ GET RECOMMENDATIONS
  // =====================================================

  getRecommendations(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.booksApiUrl}/recommendations`,
      this.getHeaders()
    );
  }
}