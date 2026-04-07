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
    return this.http.post("http://localhost:8081/upload/image", data, {responseType:'text'});
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

}