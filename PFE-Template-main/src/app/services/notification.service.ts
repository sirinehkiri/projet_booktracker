import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api =
    '/api/notifications';

  notifications$ =
    new BehaviorSubject<any[]>([]);

  unreadCount$ =
    new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}
   private getHeaders(){
      const token = localStorage.getItem("token");
  
      return {
        headers: new HttpHeaders({
          Authorization:`Bearer ${token}`
        })
      };
    }

  // =========================
  // LOAD ONCE
  // =========================
  loadNotifications() {

    this.http.get<any[]>(this.api,this.getHeaders())
      .subscribe({
        next: (data) => {

          this.notifications$.next(data);

          const unread =
            data.filter(n => !n.read).length;

          this.unreadCount$.next(unread);
        }
      });
  }

  // =========================
  // AUTO POLLING 🔥
  // =========================
  startPolling() {

    // load immediately
    this.loadNotifications();

    // refresh every 5 sec
    interval(5000).subscribe(() => {

      this.loadNotifications();
    });
  }

  // =========================
  // MARK AS READ
  // =========================
  markAsRead(id: number) {
    return this.http.put(
      `${this.api}/${id}/read`,
      {},
      this.getHeaders()
    );
  }
}