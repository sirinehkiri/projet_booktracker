import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ReadingGoal } from './reading-goal';

@Injectable({
  providedIn: 'root'
})
export class ReadingGoalService {

  private api = '/api/goals';

  constructor(private http: HttpClient,) {}
  private getHeaders(){
      const token = localStorage.getItem("token");
  
      return {
        headers: new HttpHeaders({
          Authorization:`Bearer ${token}`
        })
      };
    }

  createGoal(goal:any){
  return this.http.post<ReadingGoal>(this.api, goal, this.getHeaders());
}
  getGoals(){
    return this.http.get<any[]>(this.api,this.getHeaders());
  }

  deleteGoal(id:number){
    return this.http.delete(this.api + '/' + id,this.getHeaders());
  }

  updateProgress(id: number, pages: number) {
  return this.http.put(
    `${this.api}/${id}/progress?pages=${pages}`,
    {},
    this.getHeaders()
  );
}

  updateGoal(id: number, goal: any) {
  return this.http.put(`${this.api}/${id}/progress`, goal, this.getHeaders());
}

updateAllGoals(pages: number) {
  return this.http.put(
    `${this.api}/progress/all?pages=${pages}`,
    {},
    this.getHeaders()
  );
}
}