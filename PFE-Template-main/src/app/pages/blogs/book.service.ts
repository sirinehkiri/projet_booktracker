import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private apiUrl = "http://localhost:8081/books";

  constructor(private http: HttpClient) {}

  private getHeaders(){
    const token = localStorage.getItem("token");

    return {
      headers: new HttpHeaders({
        Authorization:`Bearer ${token}`
      })
    };
  }

  // GET
  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(this.apiUrl,this.getHeaders());
  }

  // GET ONE
  getBook(id:number): Observable<Book>{
    return this.http.get<Book>(`${this.apiUrl}/${id}`,this.getHeaders());
  }

  uploadImage(data:any){
  return this.http.post<any>("http://localhost:8081/upload/image", data);
}
  addBook(data:any){
    return this.http.post("http://localhost:8081/books", data,this.getHeaders());
  }

  // UPDATE BOOK
  updateBook(id:number, book:any){
  return this.http.put(`${this.apiUrl}/${id}`, book, this.getHeaders());
}

  // DELETE
  deleteBook(id:number){
    return this.http.delete(`${this.apiUrl}/${id}`,this.getHeaders());
  }

  addRating(bookId:number, data:any){
  return this.http.post(`http://localhost:8081/reviews/${bookId}/rating`, data, this.getHeaders());
}

  addReview(bookId:number,data:any){
    return this.http.post(`http://localhost:8081/reviews/${bookId}`, data, this.getHeaders());
  }

  addQuote(bookId:number,data:any){
    return this.http.post(`http://localhost:8081/quotes/${bookId}`, data, this.getHeaders());
  }

  voteReview(reviewId:number){
    return this.http.post(`http://localhost:8081/votes/${reviewId}`, {}, this.getHeaders());
  }

  getMyReview(bookId:number){
  return this.http.get(`http://localhost:8081/reviews/${bookId}/my`, this.getHeaders());
}
  deleteReview(id: number) {
  return this.http.delete(`http://localhost:8081/reviews/${id}`);
}

}