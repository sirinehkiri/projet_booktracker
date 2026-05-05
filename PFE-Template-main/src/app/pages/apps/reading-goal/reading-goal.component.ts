import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ReadingGoal } from './reading-goal';
import { ReadingGoalService } from './reading-goal.service';


@Component({
  selector: 'app-reading-goal',
  templateUrl: './reading-goal.component.html',
  styleUrls: ['./reading-goal.component.scss'],
})
export class ReadingGoalComponent implements OnInit{

  sidePanelOpened = true;
  showSidebar = false;

  inputFg: UntypedFormGroup = Object.create(null);

  goalId = 1;

  goals: ReadingGoal[] = [];
  copyGoals: ReadingGoal[] = [];

  selectedCategory = 'all';

  constructor(
  public fb: UntypedFormBuilder,
  private goalService: ReadingGoalService
) {}

  ngOnInit(): void {

  this.inputFg = this.fb.group({
    targetPages: [''],
    period: ['DAILY']
  });

  this.loadGoals();
}

  isOver(): boolean {
    return window.matchMedia('(max-width: 960px)').matches;
  }

  mobileSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  createGoal(): void {

  const targetPages = this.inputFg.get('targetPages')?.value;
  const period = this.inputFg.get('period')?.value;

  if (!targetPages || targetPages <= 0) {
    return;
  }

  const goal = {
    targetPages: targetPages,
    period: period
  };

  this.goalService.createGoal(goal).subscribe({
    next: (response: any) => {

      this.goals.unshift(response);
      this.copyGoals = [...this.goals];

      this.inputFg.reset({
        targetPages: '',
        period: 'DAILY'
      });
    },

    error: (err) => {
      console.error(err);
    }
  });
}

  selectionlblClick(val: string): void {
    this.selectedCategory = val;

    if (val === 'all') {
      this.copyGoals = this.goals;
    }

    if (val === 'active') {
      this.copyGoals = this.goals.filter(goal => !goal.completed);
    }

    if (val === 'completed') {
      this.copyGoals = this.goals.filter(goal => goal.completed);
    }
  }

  editGoal(id: number): void {
  const goal = this.goals.find(g => g.id === id);

  if (goal) {
    this.goalService.updateProgress(id, 1).subscribe({
      next: (res: any) => {
        goal.currentPages = res.currentPages;
        goal.completed = res.completed;
      },
      error: (err) => {
        console.error('Error updating goal', err);
      }
    });
  }
}

  deleteGoal(id: number): void {

  this.goalService.deleteGoal(id).subscribe({
    next: () => {
      this.goals = this.goals.filter(goal => goal.id !== id);
      this.copyGoals = [...this.goals];
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  activeGoalsCount(): number {
    return this.goals.filter(goal => !goal.completed).length;
  }

  completedGoalsCount(): number {
    return this.goals.filter(goal => goal.completed).length;
  }
  getProgress(goal: ReadingGoal): number {
  return goal.targetPages
    ? (goal.currentPages / goal.targetPages) * 100
    : 0;
}
loadGoals(): void {
  this.goalService.getGoals().subscribe({
    next: (data: any) => {
      this.goals = Array.isArray(data) ? data : [data];
      this.copyGoals = [...this.goals];
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}