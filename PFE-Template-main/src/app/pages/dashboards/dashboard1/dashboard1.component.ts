import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import {
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexLegend,
  ApexGrid,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions
} from 'ng-apexcharts';

import { StatisticsService } from 'src/app/services/statistics.service';
import { ReadingGoalService } from 'src/app/pages/apps/reading-goal/reading-goal.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.scss']
})
export class StatisticsComponent implements OnInit {

  isLoading = true;

  currentUserId: number | null = null;
  currentUsername = '';

  constructor(
    private statisticsService: StatisticsService,
    private goalService: ReadingGoalService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =====================================================
      STATS
  ===================================================== */

  stats: any = {
    totalBooksRead: 0,
    totalPagesRead: 0,
    totalReadingHours: 0,
    favoriteGenre: 'Aucun',
    currentlyReading: 0,
    wantToRead: 0
  };

  yearlyGoal = 0;
  yearlyGoalProgress = 0;

  /* =====================================================
      CHARTS INIT
  ===================================================== */

  booksChart: any = {
    series: [{ name: 'Livres', data: [0,0,0,0,0,0,0] }],
    chart: { type: 'area', height: 90, sparkline: { enabled: true } },
    colors: ['#5D87FF'],
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { show: false },
    tooltip: { theme: 'dark' }
  };

  pagesChart: any = {
    series: [{ name: 'Pages', data: [] }],
    chart: { type: 'bar', height: 70, sparkline: { enabled: true } },
    colors: [],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '50%', distributed: true } },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { show: false },
    xaxis: { categories: ['L','M','M','J','V','S','D'], labels: { show: false } },
    yaxis: { labels: { show: false } },
    tooltip: { theme: 'dark' }
  };

  hoursChart: any = {
    series: [{ name: 'Heures', data: [0,0,0,0,0,0,0] }],
    chart: { type: 'area', height: 90, sparkline: { enabled: true } },
    colors: ['#13DEB9'],
    stroke: { curve: 'smooth', width: 2 },
    dataLabels: { enabled: false },
    legend: { show: false },
    grid: { show: false },
    tooltip: { theme: 'dark' }
  };

  goalChart: any = {
    series: [0],
    chart: { type: 'radialBar', height: 220 },
    colors: ['#5D87FF'],
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        dataLabels: { name: { show: false }, value: { fontSize: '28px', fontWeight: 600 } }
      }
    },
    stroke: { lineCap: 'round' },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { theme: 'dark' }
  };

  monthlyReadingChart: any = {
    series: [{ name: 'Livres lus', data: [] }],
    chart: { type: 'area', height: 350, toolbar: { show: false } },
    colors: ['#5D87FF'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: [] },
    tooltip: { theme: 'dark' }
  };

  genreChart: any = {
    series: [],
    chart: { type: 'donut', height: 350 },
    labels: [],
    colors: ['#5D87FF','#49BEFF','#13DEB9','#FFAE1F','#FA896B'],
    legend: { position: 'bottom' },
    plotOptions: { pie: { donut: { size: '70%' } } },
    tooltip: { theme: 'dark' }
  };

  authorChart: any = {
    series: [{ name: 'Livres', data: [] }],
    chart: { type: 'bar', height: 320, toolbar: { show: false } },
    colors: ['#5D87FF'],
    plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
    dataLabels: { enabled: false },
    xaxis: { categories: [] },
    tooltip: { theme: 'dark' }
  };

  readingStatusChart: any = {
    series: [0,0,0],
    chart: { type: 'donut', height: 320 },
    labels: ['Lus','En cours','À lire'],
    colors: ['#13DEB9','#FFAE1F','#5D87FF'],
    plotOptions: { pie: { donut: { size: '70%' } } },
    legend: { position: 'bottom' },
    tooltip: { theme: 'dark' }
  };

  /* =====================================================
      INIT
  ===================================================== */

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.currentUserId = user.id || Number(localStorage.getItem('userId'));
    this.currentUsername = user.username || 'Lecteur';

    if (!this.currentUserId) return;

    this.loadDashboardData();
    this.loadYearlyGoal();
  }

  loadDashboardData(): void {
    this.loadGlobalStats(this.currentUserId!);
    this.loadGenreStats(this.currentUserId!);
    this.loadAuthorStats(this.currentUserId!);
    this.loadMonthlyStats(this.currentUserId!);

    this.isLoading = false;
  }

  /* =====================================================
      GLOBAL STATS
  ===================================================== */

  loadGlobalStats(userId: number): void {

    this.statisticsService.getGlobalStats(userId).subscribe({

      next: (data: any) => {

        this.stats = data;

        this.goalChart.series = [this.yearlyGoalProgress];

        this.readingStatusChart.series = [
          data.totalBooksRead,
          data.currentlyReading,
          data.wantToRead
        ];

        this.readingStatusChart = { ...this.readingStatusChart };

        this.cdr.detectChanges();
      }
    });
  }

  /* =====================================================
      GENRES
  ===================================================== */

  loadGenreStats(userId: number): void {

    this.statisticsService.getGenres(userId).subscribe({

      next: (data: any[]) => {

        this.genreChart.series = data.map(x => Number(x.total));
        this.genreChart.labels = data.map(x => x.label);

        this.genreChart = { ...this.genreChart };

        this.cdr.detectChanges();
      }
    });
  }

  /* =====================================================
      AUTHORS
  ===================================================== */

  loadAuthorStats(userId: number): void {

    this.statisticsService.getAuthors(userId).subscribe({

      next: (data: any[]) => {

        this.authorChart.series = [
          {
            name: 'Livres',
            data: data.map(x => Number(x.total))
          }
        ];

        this.authorChart.xaxis = {
          categories: data.map(x => x.label)
        };

        this.authorChart = { ...this.authorChart };

        this.cdr.detectChanges();
      }
    });
  }

  /* =====================================================
      MONTHLY STATS (FIXED)
  ===================================================== */

  loadMonthlyStats(userId: number): void {

    this.statisticsService.getMonthlyStats(userId).subscribe({

      next: (data: any[]) => {

        const months = [
          'Jan','Feb','Mar','Apr','May','Jun',
          'Jul','Aug','Sep','Oct','Nov','Dec'
        ];

        const monthMap: any = {
          JANUARY: 'Jan', FEBRUARY: 'Feb', MARCH: 'Mar',
          APRIL: 'Apr', MAY: 'May', JUNE: 'Jun',
          JULY: 'Jul', AUGUST: 'Aug', SEPTEMBER: 'Sep',
          OCTOBER: 'Oct', NOVEMBER: 'Nov', DECEMBER: 'Dec'
        };

        const monthlyData = new Array(12).fill(0);

        data.forEach(item => {

          const month = monthMap[item.month?.toUpperCase()];
          const index = months.indexOf(month);

          if (index !== -1) {
            monthlyData[index] = item.total;
          }
        });

        this.monthlyReadingChart.series = [
          { name: 'Livres lus', data: monthlyData }
        ];

        this.monthlyReadingChart.xaxis = {
          categories: months
        };

        this.monthlyReadingChart = { ...this.monthlyReadingChart };

        this.cdr.detectChanges();
      }
    });
  }

  /* =====================================================
      GOAL
  ===================================================== */

  loadYearlyGoal(): void {

    this.goalService.getGoals().subscribe({

      next: (goals: any[]) => {

        const goal = goals.find(
          g => g.period === 'YEARLY' && g.metric === 'BOOKS'
        );

        if (!goal) return;

        this.yearlyGoal = goal.targetValue;

        this.yearlyGoalProgress =
          Math.min(
            Math.round((goal.currentValue / goal.targetValue) * 100),
            100
          );

        this.goalChart.series = [this.yearlyGoalProgress];
        this.goalChart = { ...this.goalChart };

        this.cdr.detectChanges();
      }
    });
  }
}  