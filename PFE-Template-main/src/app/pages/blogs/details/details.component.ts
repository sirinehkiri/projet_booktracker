import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class AppBlogDetailsComponent implements OnInit {

  book: any;
  comments: any[] = [];
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    public bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

   /* if (this.bookService.blogPosts.length === 0) {
      this.bookService.getBlog().subscribe((data: any) => {
        this.bookService.blogPosts = data;
        this.loadBook(id);
      });
    } else {
      this.loadBook(id);
    }
      */ 
  }

  /*loadBook(id: any) {
  this.book = this.bookService.blogPosts.find(
    (b: any) => b.id == id
  );

  console.log('BOOK:', this.book);

  this.comments = [
    { user: 'Ali', rating: 5, text: 'Amazing book!' },
    { user: 'Sara', rating: 4, text: 'Very useful 👌' }
  ];
}
  */

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({
        user: 'You',
        rating: 5,
        text: this.newComment
      });
      this.newComment = '';
    }
  }

  getStars(rating: number) {
    return [1,2,3,4,5];
  }
}