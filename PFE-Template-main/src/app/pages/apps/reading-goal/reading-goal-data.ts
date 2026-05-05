export interface ReadingGoal {
  id: number;
  targetPages: number;
  currentPages: number;
  period: string;
  startDate: Date | null;
  endDate: Date | null;
  completed: boolean;
  
}
