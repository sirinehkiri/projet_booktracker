import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';

import { BookService } from '../book.service';
import { ReadingGoalService } from '../../apps/reading-goal/reading-goal.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBlogDetailsComponent implements OnInit {

  loading = false;

  book: any = null;

  newQuote: string = '';

  currentUserId!: number;

  currentStatus: string = 'WANT_TO_READ';

  showStatusModal = false;

  showActivity = false;

  pagesRead: number = 0;
  readingTime = 0;

  totalReadPages: number = 0;

  editingQuoteId: number | null = null;
  editingQuoteContent = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    public bookService: BookService,
    private goalService: ReadingGoalService
  ) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.currentUserId = user?.id;

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadBook(Number(id));
    }
  }

  // ======================================================
  // LOAD BOOK
  // ======================================================

  loadBook(id: number): void {

    this.loading = true;

   forkJoin({

  book: this.bookService.getBook(id),

  status: this.bookService.getUserStatus(id),

  userBook: this.bookService.getUserBook(id)

}).subscribe({

  next: ({ book, status, userBook }: any) => {

    this.book = {
      ...book,
      reviews: book.reviews ?? [],
      quotes: book.quotes ?? [],
      progress: Math.min(
        userBook?.progress ?? 0,
        100
      )
    };

    this.currentStatus = status;

    if (userBook) {

      this.book.userBookId = userBook.id;

      this.totalReadPages =
        this.totalReadPages = Math.min(
          userBook.pagesRead ?? 0,
          book.total_pages
        );

      this.pagesRead = 0;
    }

    this.loading = false;

    this.cdr.markForCheck();
  },

  error: (err) => {

    console.error(err);

    this.loading = false;

    this.showMessage('Failed to load book');

    this.cdr.markForCheck();
  }

});
  }

  // ======================================================
  // STARS
  // ======================================================

  getFullStars(): any[] {

    if (!this.book?.averageRating) {
      return [];
    }

    return Array(Math.floor(this.book.averageRating));
  }

  hasHalfStar(): boolean {

    if (!this.book?.averageRating) {
      return false;
    }

    return this.book.averageRating % 1 >= 0.5;
  }

  getEmptyStars(): any[] {

    if (!this.book?.averageRating) {
      return Array(5);
    }

    const full = Math.floor(this.book.averageRating);

    const half = this.hasHalfStar() ? 1 : 0;

    return Array(5 - full - half);
  }

  getStars(rating: number): any[] {
    return Array(rating);
  }

  // ======================================================
  // TRACK BY
  // ======================================================

  trackByReview(index: number, item: any): number {
    return item.id;
  }

  trackByQuote(index: number, item: any): number {
    return item.id;
  }

  // ======================================================
  // QUOTES
  // ======================================================

  addQuote(): void {

    if (!this.newQuote.trim()) {
      return;
    }

    const payload = {
      content: this.newQuote
    };

    this.bookService.addQuote(this.book.id, payload)
      .subscribe({

        next: (res: any) => {

          this.book.quotes.unshift(res);

          this.newQuote = '';

          this.showMessage('Quote added');

          this.cdr.markForCheck();
        },

        error: (err) => {
          this.handleError(err);
        }

      });
  }

  // ======================================================
  // LIKE REVIEW
  // ======================================================

  vote(reviewId: number): void {

  const review = this.book.reviews.find(
    (r: any) => r.id === reviewId
  );

  if (!review) {
    return;
  }

  this.bookService.voteReview(reviewId)
    .subscribe({

      next: (res: any) => {

        review.liked = res.liked;

        review.likesCount = res.likesCount;

        this.cdr.markForCheck();
      },

      error: (err) => {
        this.handleError(err);
      }

    });
}

  // ======================================================
  // DELETE REVIEW
  // ======================================================

  deleteReview(id: number): void {

    const confirmDelete = confirm(
      'Delete this review ?'
    );

    if (!confirmDelete) {
      return;
    }

    this.bookService.deleteReview(id)
      .subscribe({

        next: () => {

          this.book.reviews =
            this.book.reviews.filter(
              (r: any) => r.id !== id
            );

          this.showMessage('Review deleted');

          this.cdr.markForCheck();
        },

        error: (err) => {
          this.handleError(err);
        }

      });
  }

  // ======================================================
  // STATUS MODAL
  // ======================================================

  openStatusModal(): void {
    this.showStatusModal = true;
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
  }

  setStatus(status: string): void {

    this.currentStatus = status;

    this.closeStatusModal();

    this.bookService
      .setStatus(this.book.id, status)
      .subscribe({

        next: () => {

          this.showMessage('Status updated');

          this.cdr.markForCheck();
        },

        error: (err) => {
          this.handleError(err);
        }

      });
  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'READ':
        return 'Read';

      case 'READING':
        return 'Currently Reading';

      case 'WANT_TO_READ':
        return 'Want to Read';

      default:
        return 'Select Status';
    }
  }

  // ======================================================
  // ACTIVITY
  // ======================================================

  openActivity(): void {
    this.showActivity = true;
  }

  closeActivity(): void {
    this.showActivity = false;
  }

  updateProgress(): void {

  if (!this.book?.userBookId) {
    return;
  }

  if (this.pagesRead <= 0) {

    this.showMessage(
      'Pages must be greater than 0'
    );

    return;
  }

  // Remaining pages
  const remainingPages =
    this.book.total_pages - this.totalReadPages;

  // Prevent overflow
  const pagesToAdd = Math.min(
    this.pagesRead,
    remainingPages
  );

  // Update local UI
  this.totalReadPages += pagesToAdd;

  this.book.progress =
    (this.totalReadPages / this.book.total_pages) * 100;

  // Security
  if (this.book.progress > 100) {
    this.book.progress = 100;
  }

  const payload = {

    userBookId: this.book.userBookId,

    pagesRead: pagesToAdd,
    readingTime: this.readingTime
  };

  this.bookService.updateProgress(payload)
    .subscribe({

      next: () => {

        // =====================================
        // AUTO CHANGE STATUS TO READ
        // =====================================

        if (this.book.progress >= 100) {

          this.currentStatus = 'READ';

          this.bookService
            .setStatus(this.book.id, 'READ')
            .subscribe({

              next: () => {

                this.showMessage(
                  'Book completed 🎉'
                );

                this.cdr.markForCheck();
              },

              error: (err) => {
                console.error(err);
              }

            });
        }

        // Update goals
        this.updateReadingGoals(pagesToAdd);

        this.showMessage(
          'Progress updated'
        );

        this.pagesRead = 0;

        this.closeActivity();

        this.cdr.markForCheck();
      },

      error: (err) => {
        this.handleError(err);
      }

    });
}

  updateReadingGoals(pages: number): void {

    this.goalService
      .updateAllGoals(pages)
      .subscribe({

        next: () => {
          console.log('Goals updated');
        },

        error: (err) => {
          console.error(err);
        }

      });
  }

  // ======================================================
  // HELPERS
  // ======================================================

  showMessage(message: string): void {

    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    );
  }

  handleError(error: any): void {

    console.error(error);

    this.showMessage(
      'Something went wrong'
    );
  }

  voteQuote(quoteId: number): void {

  const quote = this.book.quotes.find(
    (q: any) => q.id === quoteId
  );

  if (!quote) {
    return;
  }

  this.bookService.voteQuote(quoteId)
    .subscribe({

      next: (res: any) => {

        quote.liked = res.liked;

        quote.likesCount = res.likesCount;

        this.cdr.markForCheck();
      },

      error: (err) => {
        this.handleError(err);
      }

    });
}

editQuote(q: any): void {

  this.editingQuoteId = q.id;

  this.editingQuoteContent = q.content;
}

saveQuote(q: any): void {

  if (!this.editingQuoteContent.trim()) {
    return;
  }

  const payload = {
    content: this.editingQuoteContent
  };

  this.bookService
    .updateQuote(q.id, payload)
    .subscribe({

      next: (res: any) => {

        q.content = res.content;

        this.editingQuoteId = null;

        this.editingQuoteContent = '';

        this.showMessage('Quote updated');

        this.cdr.markForCheck();
      },

      error: (err:any) => {
        this.handleError(err);
      }

    });
}

cancelEditQuote(): void {

  this.editingQuoteId = null;

  this.editingQuoteContent = '';
}

deleteQuote(id: number): void {

  const confirmDelete = confirm(
    'Delete this quote ?'
  );

  if (!confirmDelete) {
    return;
  }

  this.bookService
    .deleteQuote(id)
    .subscribe({

      next: () => {

        this.book.quotes =
          this.book.quotes.filter(
            (q: any) => q.id !== id
          );

        this.showMessage('Quote deleted');

        this.cdr.markForCheck();
      },

      error: (err:any) => {
        this.handleError(err);
      }

    });
}

addReply(review: any): void {

  if (!review.replyContent?.trim()) {
    return;
  }

  const payload = {
    content: review.replyContent
  };

  this.bookService
    .addReply(review.id, payload)
    .subscribe({

      next: (res: any) => {

        if (!review.replies) {
          review.replies = [];
        }

        review.replies.push(res);

        review.replyContent = '';

        this.showMessage('Reply added');

        this.cdr.markForCheck();
      },

      error: (err:any) => {
        this.handleError(err);
      }

    });
}

deleteReply(
  replyId: number,
  review: any
): void {

  this.bookService
    .deleteReply(replyId)
    .subscribe({

      next: () => {

        review.replies =
          review.replies.filter(
            (r: any) => r.id !== replyId
          );

        this.showMessage('Reply deleted');

        this.cdr.markForCheck();
      },

      error: (err:any) => {
        this.handleError(err);
      }

    });
}

getUserProfileImage(user: any): string | null {

  if (user?.image) {

    return `http://localhost:8081/uploads/${user.image}`;
  }

  return null;
}

getUserInitial(user: any): string {

  if (user?.username) {

    return user.username.charAt(0).toUpperCase();
  }

  return 'U';
}
} 