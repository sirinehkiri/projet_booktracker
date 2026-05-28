import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { BookService } from '../book.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewComponent implements OnInit {

  bookId!: number;

  selectedRating = 0;

  hoverRating = 0;

  comment = '';

  loading = false;

  saving = false;

  isEditMode = false;

  ratingLabels: any = {
    1: 'Terrible',
    2: 'Bad',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
    private location: Location
  ) {}

  ngOnInit(): void {

    this.bookId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadMyReview();
  }

  // ======================================================
  // LOAD REVIEW
  // ======================================================

  loadMyReview(): void {

    this.loading = true;

    this.bookService
      .getMyReview(this.bookId)
      .subscribe({

        next: (res: any) => {

          if (res) {

            this.isEditMode = true;

            this.selectedRating = res.rating;

            this.comment = res.comment;
          }

          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(err);

          this.loading = false;

          this.cdr.markForCheck();
        }

      });
  }

  // ======================================================
  // STAR EVENTS
  // ======================================================

  setRating(star: number): void {
    this.selectedRating = star;
  }

  setHover(star: number): void {
    this.hoverRating = star;
  }

  clearHover(): void {
    this.hoverRating = 0;
  }

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  submit(): void {

    if (!this.selectedRating || !this.comment.trim()) {

      this.showMessage(
        'Please complete your review'
      );

      return;
    }

    this.saving = true;

    const data = {

      rating: this.selectedRating,

      comment: this.comment.trim()
    };

    this.bookService
      .addReview(this.bookId, data)
      .subscribe({

        next: () => {

          this.saving = false;

          this.showMessage(
            this.isEditMode
              ? 'Review updated successfully'
              : 'Review added successfully'
          );

          this.router.navigate([
            'apps/blog/detail',
            this.bookId
          ]);

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(err);

          this.saving = false;

          this.showMessage(
            'Failed to save review'
          );

          this.cdr.markForCheck();
        }

      });
  }

  // ======================================================
  // HELPERS
  // ======================================================

  get currentLabel(): string {

    return this.ratingLabels[
      this.hoverRating || this.selectedRating
    ];
  }

  showMessage(message: string): void {

    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    );
  }

  goBack(): void {
    this.location.back();
}
}