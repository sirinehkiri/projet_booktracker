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
    if (id) {
      this.loadBook(Number(id));
  }
}

  loadBook(id:number){
    this.bookService.getBook(id).subscribe(data=>{
      console.log("BOOKS:", data);
      this.book = data;
    });
  }


  addComment() {

  if(!this.newComment.trim()) return;

  const review = {
    rating: 5,
    comment: this.newComment
  };

  this.bookService.addReview(this.book.id,review).subscribe(res=>{

    if(!this.book.reviews){
      this.book.reviews=[];
    }

    this.book.reviews.push(res);

    this.newComment="";
  });
}

  getStars(rating: number) {
  return Array(rating);
}
}