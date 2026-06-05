import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private baseUrl = '/auth';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
  login(data: any) {
    console.log(data)
    return this.http.post(`${this.baseUrl}/login`, data);
  }
isAdmin(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.roles && payload.roles.includes('ROLE_ADMIN');
}
}