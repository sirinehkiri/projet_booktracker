import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import { ReadingGoalService } from '../../apps/reading-goal/reading-goal.service'

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

  showStatusModal = false;
  
  isOpen = false;
  showActivity: boolean = false;
  pagesRead: number = 0;
  totalReadPages: number = 0;

  constructor(
    private route: ActivatedRoute,
    public bookService: BookService,
    private goalService: ReadingGoalService
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
    this.bookService.getBook(id).subscribe({
      next: (data) => {
        console.log("BOOKS:", data);
        this.book = data;
        this.book.quotes ??= [];
        this.book.reviews ??= [];
        this.book.likes ??= 0;
        this.bookService.getUserStatus(this.book.id).subscribe({
          next: (status) => {
            this.currentStatus = status;
            console.log("STATUS:", status);
          },
          error: (err) => {
            console.error("Status error:", err);
          }
        });
        this.bookService.getUserBook(this.book.id).subscribe({
        next: (ub:any) => {
          console.log("USERBOOK:", ub);
          console.log("USERBOOK:", ub.progress);
          if (ub) {
            this.book.userBookId = ub.id;
            this.totalReadPages = ub.pagesRead ?? 0; 
            this.pagesRead = 0;
            this.book.progress = ub.progress ?? 0;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
      },
      error: (err) => {
        console.error("Book error:", err);
      }
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

  openStatusModal() {
  this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
  }

  setStatus(status: string) {
    this.currentStatus = status;
    this.showStatusModal = false;
    this.bookService.setStatus(this.book.id, status)
      .subscribe(() => {
        console.log("Status updated");
      });
    this.loadBook(this.book.id);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'READ': return 'Read';
      case 'READING': return 'Currently Reading';
      case 'WANT_TO_READ': return 'Want to Read';
      default: return 'Select Status';
    }
  }

  openActivity() {
    this.showActivity = true;
  }

  closeActivity() {
    this.showActivity = false;
  }

 updateProgress() {
  if (!this.book || !this.book.userBookId) {
    console.error("UserBook introuvable");
    return;
  }

  // 1. Update UI
  this.totalReadPages += this.pagesRead;

  if (this.totalReadPages > this.book.total_pages) {
    this.totalReadPages = this.book.total_pages;
  }

  this.book.progress = (this.totalReadPages / this.book.total_pages) * 100;

  const payload = {
    userBookId: this.book.userBookId,
    pagesRead: this.pagesRead
  };

  // 2. Update book progress
  this.bookService.updateProgress(payload).subscribe({
    next: () => {
      console.log("Progress updated");

      // 🔥 3. UPDATE GOALS AUSSI
      this.updateReadingGoals(this.pagesRead);

    },
    error: (err) => console.error(err)
  });

  this.showActivity = false;
}

updateReadingGoals(pages: number) {

  this.goalService.updateAllGoals(this.pagesRead).subscribe({
  next: () => console.log("All goals updated"),
  error: (err) => console.error(err)
});
}
}