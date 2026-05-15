import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private api = 'http://localhost:8081/api/statistics';

  constructor(private http: HttpClient) {}

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getGlobalStats(userId: number) {
    return this.http.get<any>(
      `${this.api}/global/${userId}`,
      this.getHeaders()
    );
  }

  getGenres(userId: number) {
    return this.http.get<any[]>(
      `${this.api}/genres/${userId}`,
      this.getHeaders()
    );
  }

  getAuthors(userId: number) {
    return this.http.get<any[]>(
      `${this.api}/authors/${userId}`,
      this.getHeaders()
    );
  }

  getMonthlyStats(userId: number) {
    return this.http.get<any[]>(
      `${this.api}/monthly/${userId}`,
      this.getHeaders()
    );
  }

  getStatusStats(userId: number) {
    return this.http.get<any>(
      `${this.api}/status/${userId}`,
      this.getHeaders()
    );
  }
}