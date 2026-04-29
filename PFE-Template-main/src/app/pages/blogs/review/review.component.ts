import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { BookService } from '../book.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})

export class ReviewComponent implements OnInit {

  bookId!: number;
  selectedRating = 0;
  comment = ''; 
  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadMyReview();
  }

  loadMyReview() {
    this.bookService.getMyReview(this.bookId).subscribe((res:any) => {

      if(res){
        // 🔥 MODE EDIT
        this.selectedRating = res.rating;
        this.comment = res.comment;
      }

    });
  }

  submit() {

    const data = {
      rating: this.selectedRating,
      comment: this.comment
    };

    this.bookService.addReview(this.bookId, data).subscribe(res => {
      alert("Review saved!");
    });
    this.router.navigate(['apps/blog/detail', this.bookId]);
  }
}