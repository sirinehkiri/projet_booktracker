export interface ReadingGoal {
  id: number;

  targetValue: number;      
  currentValue: number;     

  metric: 'PAGES' | 'BOOKS';
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

  completed: boolean;

  startDate: string;
  endDate: string;

  lastNotification?: string; 
}