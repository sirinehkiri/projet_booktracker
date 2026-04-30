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
  newQuote: string = '';

  selectedRating = 0;  
  hoverRating = 0;
  currentUserId!: number;

  currentStatus: string = 'WANT_TO_READ';
  
  isOpen = false;

  constructor(
    private route: ActivatedRoute,
    public bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(Number(id));
  }
    const user = JSON.parse(localStorage.getItem('user')!);
    this.currentUserId = user.id;
}

loadBook(id: number) {
  this.bookService.getBook(id).subscribe(data => {
    console.log("BOOKS:", data);

    this.book = data;

    this.book.quotes ??= [];
    this.book.reviews ??= [];
    this.book.likes ??= 0;

    this.bookService.getUserStatus(this.book.id).subscribe(status => {
      this.currentStatus = status;
      console.log("STATUS:", status);
    });

  });
}

  getFullStars() {
    return Array(Math.floor(this.book.averageRating));
  }

  hasHalfStar() {
    return this.book.averageRating % 1 >= 0.5;
  }

  getEmptyStars() {
    const full = Math.floor(this.book.averageRating);
    const half = this.hasHalfStar() ? 1 : 0;
    return Array(5 - full - half);
  }

  submitReview() {
  const data = {
    rating: this.selectedRating,
    comment: this.newComment
  };

  this.bookService.addReview(this.book.id, data).subscribe(res => {
    this.updateReviewInUI(res);
  });
}

  calculateAverage() {
  if (!this.book.reviews || this.book.reviews.length === 0) {
    return 0;
  }

  let sum = 0;
  this.book.reviews.forEach((r: any) => {
    sum += r.rating;
  });

  return sum / this.book.reviews.length;
}

updateReviewInUI(updatedReview: any) {

  if (!this.book.reviews) {
    this.book.reviews = [];
  }

  const index = this.book.reviews.findIndex(
    (r: any) => r.user?.id === updatedReview.user?.id
  );

  if (index !== -1) {
    this.book.reviews[index] = updatedReview; // update
  } else {
    this.book.reviews.push(updatedReview); // add
  }

  this.book.averageRating = this.calculateAverage();
}

  getStars(rating: number) {
    return Array(rating);
  }

  addQuote() {
    if (!this.newQuote?.trim()) return;

    const quote = {
      content: this.newQuote
    };

    this.bookService.addQuote(this.book.id, quote).subscribe((res: any) => {
      if (!this.book.quotes) {
        this.book.quotes = [];
      }

      this.book.quotes.push(res);
      this.newQuote = '';
    });
  }

  vote(reviewId: number) {
  this.bookService.voteReview(reviewId).subscribe((res: any) => {

    const review = this.book.reviews.find((r: any) => r.id === reviewId);

    if (review) {
      review.liked = res.status === 'liked';
    }

  });
}

deleteReview(id: number) {
  console.log(id)
  if (!confirm('Delete this review?')) return;

  this.bookService.deleteReview(id).subscribe(() => {
    this.book.reviews = this.book.reviews.filter((r: any) => r.id !== id);
  });
}
toggleDropdown() {
  this.isOpen = !this.isOpen;
}
setStatus(status: string) {
  this.currentStatus = status;
  this.isOpen = false;
  this.bookService.setStatus(this.book.id, status)
    .subscribe(() => {
      console.log("Status updated");
    });
}
getStatusLabel(status: string): string {
  switch (status) {
    case 'READ': return '✅ Read';
    case 'READING': return '📖 Currently Reading';
    case 'WANT_TO_READ': return '⭐ Want to Read';
    default: return 'Select Status';
  }
}
}