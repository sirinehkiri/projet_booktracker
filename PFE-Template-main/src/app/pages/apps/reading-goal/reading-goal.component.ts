import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

import { ReadingGoal } from './reading-goal';
import { ReadingGoalService } from './reading-goal.service';

@Component({
  selector: 'app-reading-goal',
  templateUrl: './reading-goal.component.html',
  styleUrls: ['./reading-goal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingGoalComponent implements OnInit {

  sidePanelOpened = true;

  loading = false;

  creating = false;

  selectedCategory = 'all';

  inputFg!: FormGroup;

  goals: ReadingGoal[] = [];

  copyGoals: ReadingGoal[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private goalService: ReadingGoalService
  ) {}

  ngOnInit(): void {

    this.initializeForm();

    this.loadGoals();
  }

  // ======================================================
  // FORM
  // ======================================================

  initializeForm(): void {

    this.inputFg = this.fb.group({

      targetValue: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      metric: [
        'PAGES',
        Validators.required
      ],

      period: [
        'DAILY',
        Validators.required
      ]
    });
  }

  // ======================================================
  // LOAD GOALS
  // ======================================================

  loadGoals(): void {

    this.loading = true;

    this.goalService.getGoals()
      .subscribe({

        next: (data: any) => {

          this.goals =
            Array.isArray(data)
              ? data
              : [data];

          this.copyGoals = [...this.goals];

          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(err);

          this.loading = false;

          this.showMessage(
            'Failed to load goals'
          );

          this.cdr.markForCheck();
        }

      });
  }

  // ======================================================
  // CREATE GOAL
  // ======================================================

  createGoal(): void {

    if (this.inputFg.invalid) {

      this.inputFg.markAllAsTouched();

      return;
    }

    this.creating = true;

    const goal = this.inputFg.value;

    this.goalService.createGoal(goal)
      .subscribe({

        next: (res: any) => {

          this.goals.unshift(res);

          this.filterGoals(
            this.selectedCategory
          );

          this.inputFg.reset({
            metric: 'PAGES',
            period: 'DAILY'
          });

          this.creating = false;

          this.showMessage(
            'Goal created successfully'
          );

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(err);

          this.creating = false;

          this.showMessage(
            'Failed to create goal'
          );

          this.cdr.markForCheck();
        }

      });
  }

  // ======================================================
  // FILTER
  // ======================================================

  filterGoals(category: string): void {

    this.selectedCategory = category;

    switch (category) {

      case 'active':

        this.copyGoals =
          this.goals.filter(
            goal => !goal.completed
          );

        break;

      case 'completed':

        this.copyGoals =
          this.goals.filter(
            goal => goal.completed
          );

        break;

      default:

        this.copyGoals = [...this.goals];
    }

    this.cdr.markForCheck();
  }

  // ======================================================
  // DELETE
  // ======================================================

  deleteGoal(id: number): void {

    const confirmDelete =
      confirm('Delete this goal?');

    if (!confirmDelete) {
      return;
    }

    this.goalService.deleteGoal(id)
      .subscribe({

        next: () => {

          this.goals =
            this.goals.filter(
              goal => goal.id !== id
            );

          this.filterGoals(
            this.selectedCategory
          );

          this.showMessage(
            'Goal deleted'
          );

          this.cdr.markForCheck();
        },

        error: (err) => {

          console.error(err);

          this.showMessage(
            'Failed to delete goal'
          );
        }

      });
  }

  // ======================================================
  // COUNTS
  // ======================================================

  activeGoalsCount(): number {

    return this.goals.filter(
      goal => !goal.completed
    ).length;
  }

  completedGoalsCount(): number {

    return this.goals.filter(
      goal => goal.completed
    ).length;
  }

  // ======================================================
  // PROGRESS
  // ======================================================

  getProgress(goal: ReadingGoal): number {

    if (!goal.targetValue) {
      return 0;
    }

    const progress =
      (goal.currentValue / goal.targetValue) * 100;

    return Math.min(progress, 100);
  }

  getProgressColor(goal: ReadingGoal): string {

    const progress = this.getProgress(goal);

    if (progress >= 100) {
      return 'completed';
    }

    if (progress >= 70) {
      return 'good';
    }

    return 'normal';
  }

  // ======================================================
  // HELPERS
  // ======================================================

  trackByGoal(
    index: number,
    item: ReadingGoal
  ): number {

    return item.id;
  }

  isOver(): boolean {

    return window.matchMedia(
      '(max-width: 960px)'
    ).matches;
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
}