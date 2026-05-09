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

  private getHeaders() {
    const token = localStorage.getItem("token");
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // =====================================================
  // GET ALL BOOKS
  // =====================================================

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(
      this.apiUrl,
      this.getHeaders()
    );
  }

  // =====================================================
  // GET ONE BOOK
  // =====================================================

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  uploadImage(data: any) {
    return this.http.post<any>(
      "http://localhost:8081/upload/image",
      data
    );
  }

  // =====================================================
  // ADD BOOK
  // =====================================================

  addBook(data: any) {
    return this.http.post(
      "http://localhost:8081/books",
      data,
      this.getHeaders()
    );
  }

  // =====================================================
  // UPDATE BOOK
  // =====================================================

  updateBook(id: number, book: any) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      book,
      this.getHeaders()
    );
  }

  // =====================================================
  // DELETE BOOK
  // =====================================================

  deleteBook(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

  // =====================================================
  // ADD RATING
  // =====================================================

  addRating(bookId: number, data: any) {
    return this.http.post(
      `http://localhost:8081/reviews/${bookId}/rating`,
      data,
      this.getHeaders()
    );
  }

  // =====================================================
  // ADD REVIEW
  // =====================================================

  addReview(bookId: number, data: any) {
    return this.http.post(
      `http://localhost:8081/reviews/${bookId}`,
      data,
      this.getHeaders()
    );
  }

  // =====================================================
  // ADD QUOTE
  // =====================================================

  addQuote(bookId: number, data: any) {
    return this.http.post(
      `http://localhost:8081/quotes/${bookId}`,
      data,
      this.getHeaders()
    );
  }

  // =====================================================
  // VOTE REVIEW
  // =====================================================

  voteReview(reviewId: number) {
    return this.http.post(
      `http://localhost:8081/votes/${reviewId}`,
      {},
      this.getHeaders()
    );
  }

  // =====================================================
  // GET MY REVIEW
  // =====================================================

  getMyReview(bookId: number) {
    return this.http.get(
      `http://localhost:8081/reviews/${bookId}/my`,
      this.getHeaders()
    );
  }

  // =====================================================
  // DELETE REVIEW
  // =====================================================

  deleteReview(id: number) {
    return this.http.delete(
      `http://localhost:8081/reviews/${id}`
    );
  }

  // =====================================================
  // SET STATUS
  // =====================================================

  setStatus(bookId: number, status: string) {
    return this.http.post(
      `http://localhost:8081/api/userbooks/status?bookId=${bookId}&status=${status}`,
      {},
      this.getHeaders()
    );
  }

  // =====================================================
  // GET USER STATUS
  // =====================================================

  getUserStatus(bookId: number) {
    return this.http.get<string>(
      `http://localhost:8081/api/userbooks/status?bookId=${bookId}`,
      this.getHeaders()
    );
  }

  // =====================================================
  // GET USER BOOK
  // =====================================================

  getUserBook(bookId: number) {
    return this.http.get(
      `http://localhost:8081/api/userbooks/book/${bookId}`,
      this.getHeaders()
    );
  }

  // =====================================================
  // UPDATE PROGRESS
  // =====================================================

  updateProgress(data: any) {
    return this.http.post(
      'http://localhost:8081/reading/progress',
      data,
      this.getHeaders()
    );
  }

  // =====================================================
  // SEARCH
  // =====================================================

  searchBooks(keyword: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/search`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        params: { keyword }
      }
    );
  }

  // =====================================================
  // ADVANCED SEARCH
  // =====================================================

  advancedSearch(filters: {
    title?: string;
    author?: string;
    genre?: string;
    year?: number;
  }): Observable<Book[]> {

    let params: any = {};

    if (filters.title)  params.title  = filters.title;
    if (filters.author) params.author = filters.author;
    if (filters.genre)  params.genre  = filters.genre;
    if (filters.year)   params.year   = filters.year;

    return this.http.get<Book[]>(
      `${this.apiUrl}/search/advanced`,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }),
        params
      }
    );
  }

  // =====================================================
  // TRENDING
  // =====================================================

  getTrendingBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/trending`,
      this.getHeaders()
    );
  }

  // =====================================================
  // RECENTLY ADDED
  // =====================================================

  getRecentlyAdded(): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/recent`,
      this.getHeaders()
    );
  }

  // =====================================================
  // BY GENRE
  // =====================================================

  getBooksByGenre(genre: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/genre/${genre}`,
      this.getHeaders()
    );
  }

  // =====================================================
  // ALL GENRES
  // =====================================================

  getAllGenres(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/genres`,
      this.getHeaders()
    );
  }

  // =====================================================
  // RECOMMENDATIONS
  // =====================================================

  getRecommendations(): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.apiUrl}/recommendations`,
      this.getHeaders()
    );
  }
  
}