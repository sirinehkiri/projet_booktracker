export class ReadingGoal {
  id = 0;
  targetPages = 0;
  currentPages = 0;
  period = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  completed = false;
}