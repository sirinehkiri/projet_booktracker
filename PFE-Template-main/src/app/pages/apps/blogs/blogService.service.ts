import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { blogPosts } from './blogData';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogPosts: any[] = [];
  detailId: string = '';

  constructor(private http: HttpClient) {}

  public getBlog(): Observable<any> {
    return of(blogPosts);
  }

}