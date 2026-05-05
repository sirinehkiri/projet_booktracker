import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadingGoalService {

  private api = 'http://localhost:8081/api/goals';

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
    return this.http.post(this.api, goal,this.getHeaders());
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
}