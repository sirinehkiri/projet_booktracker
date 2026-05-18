import { Component, OnInit } from '@angular/core';

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
      BOOKS CHART
  ===================================================== */

  booksChart = {

    series: [
      {
        name: 'Livres',
        data: [2, 4, 5, 6, 8, 10, 12]
      }
    ] as ApexAxisChartSeries,

    chart: {
      type: 'area' as const,
      height: 90,

      sparkline: {
        enabled: true
      },

      toolbar: {
        show: false
      }
    } as ApexChart,

    colors: ['#5D87FF'],

    stroke: {
      curve: 'smooth' as const,
      width: 2
    } as ApexStroke,

    dataLabels: {
      enabled: false
    } as ApexDataLabels,

    legend: {
      show: false
    } as ApexLegend,

    grid: {
      show: false
    } as ApexGrid,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      PAGES CHART
  ===================================================== */

  pagesChart = {

    series: [
      {
        name: 'Pages',
        data: [20, 40, 35, 60, 80, 120, 140]
      }
    ] as ApexAxisChartSeries,

    chart: {
      type: 'bar' as const,
      height: 70,

      sparkline: {
        enabled: true
      },

      toolbar: {
        show: false
      }
    } as ApexChart,

    colors: [
      '#E8F7FF',
      '#E8F7FF',
      '#49BEFF',
      '#E8F7FF',
      '#E8F7FF',
      '#E8F7FF',
      '#E8F7FF'
    ],

    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '50%',
        distributed: true
      }
    } as ApexPlotOptions,

    dataLabels: {
      enabled: false
    } as ApexDataLabels,

    legend: {
      show: false
    } as ApexLegend,

    grid: {
      show: false
    } as ApexGrid,

    xaxis: {
      categories: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],

      labels: {
        show: false
      }
    } as ApexXAxis,

    yaxis: {
      labels: {
        show: false
      }
    } as ApexYAxis,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      HOURS CHART
  ===================================================== */

  hoursChart = {

    series: [
      {
        name: 'Heures',
        data: [1, 2, 2, 4, 3, 5, 6]
      }
    ] as ApexAxisChartSeries,

    chart: {
      type: 'area' as const,
      height: 90,

      sparkline: {
        enabled: true
      },

      toolbar: {
        show: false
      }
    } as ApexChart,

    colors: ['#13DEB9'],

    stroke: {
      curve: 'smooth' as const,
      width: 2
    } as ApexStroke,

    dataLabels: {
      enabled: false
    } as ApexDataLabels,

    legend: {
      show: false
    } as ApexLegend,

    grid: {
      show: false
    } as ApexGrid,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      GOAL CHART
  ===================================================== */

  goalChart = {

    series: [0] as ApexNonAxisChartSeries,

    chart: {
      type: 'radialBar' as const,
      height: 220
    } as ApexChart,

    colors: ['#5D87FF'],

    plotOptions: {

      radialBar: {

        hollow: {
          size: '70%'
        },

        dataLabels: {

          name: {
            show: false
          },

          value: {
            fontSize: '28px',
            fontWeight: 600
          }
        }
      }

    } as ApexPlotOptions,

    stroke: {
      lineCap: 'round' as const
    } as ApexStroke,

    dataLabels: {
      enabled: false
    } as ApexDataLabels,

    legend: {
      show: false
    } as ApexLegend,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      MONTHLY READING
  ===================================================== */

  monthlyReadingChart = {

    series: [
      {
        name: 'Livres lus',
        data: [] as number[]
      }
    ] as ApexAxisChartSeries,

    chart: {
      type: 'area' as const,
      height: 350,

      toolbar: {
        show: false
      }
    } as ApexChart,

    colors: ['#5D87FF'],

    stroke: {
      curve: 'smooth' as const,
      width: 3
    } as ApexStroke,

    xaxis: {
      categories: [] as string[]
    } as ApexXAxis,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      GENRES
  ===================================================== */

  genreChart = {

    series: [] as ApexNonAxisChartSeries,

    chart: {
      type: 'donut' as const,
      height: 350
    } as ApexChart,

    labels: [] as string[],

    colors: [
      '#5D87FF',
      '#49BEFF',
      '#13DEB9',
      '#FFAE1F',
      '#FA896B'
    ],

    legend: {
      position: 'bottom' as const
    } as ApexLegend,

    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    } as ApexPlotOptions,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      AUTHORS
  ===================================================== */

  authorChart = {

    series: [
      {
        name: 'Livres',
        data: [] as number[]
      }
    ] as ApexAxisChartSeries,

    chart: {
      type: 'bar' as const,
      height: 320,

      toolbar: {
        show: false
      }
    } as ApexChart,

    colors: ['#5D87FF'],

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%'
      }
    } as ApexPlotOptions,

    dataLabels: {
      enabled: false
    } as ApexDataLabels,

    xaxis: {
      categories: [] as string[]
    } as ApexXAxis,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  /* =====================================================
      READING STATUS
  ===================================================== */

  readingStatusChart = {

    series: [0, 0, 0] as ApexNonAxisChartSeries,

    chart: {
      type: 'donut' as const,
      height: 320
    } as ApexChart,

    labels: [
      'Lus',
      'En cours',
      'À lire'
    ],

    colors: [
      '#13DEB9',
      '#FFAE1F',
      '#5D87FF'
    ],

    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    } as ApexPlotOptions,

    legend: {
      position: 'bottom' as const
    } as ApexLegend,

    tooltip: {
      theme: 'dark'
    } as ApexTooltip
  };

  constructor(
    private statisticsService: StatisticsService,
    private goalService: ReadingGoalService
  ) {}

  ngOnInit(): void {

    this.loadUser();
  }

  /* =====================================================
      USER
  ===================================================== */

  loadUser(): void {

    const storedUser = localStorage.getItem('user');

    if (storedUser) {

      const user = JSON.parse(storedUser);

      this.currentUserId = user.id;
      this.currentUsername = user.username;

    } else {

      this.currentUserId =
        Number(localStorage.getItem('userId'));

      this.currentUsername =
        localStorage.getItem('username') || 'Lecteur';
    }

    if (!this.currentUserId) {

      console.error('Utilisateur introuvable');
      return;
    }

    this.loadDashboardData();
    this.loadYearlyGoal();
  }

  /* =====================================================
      LOAD DATA
  ===================================================== */

  loadDashboardData(): void {

    if (!this.currentUserId) return;

    this.loadGlobalStats(this.currentUserId);
    this.loadGenreStats(this.currentUserId);
    this.loadAuthorStats(this.currentUserId);
    this.loadMonthlyStats(this.currentUserId);

    this.isLoading = false;
  }

  /* =====================================================
      GLOBAL STATS
  ===================================================== */

  loadGlobalStats(userId: number): void {

    this.statisticsService
      .getGlobalStats(userId)
      .subscribe({

        next: (data: any) => {

          this.stats = data;

          this.goalChart.series = [
            this.yearlyGoalProgress
          ];

          this.readingStatusChart.series = [
            data.totalBooksRead,
            data.currentlyReading,
            data.wantToRead
          ];

          this.doughnutChartData = {

            labels: [
              'Lus',
              'En cours',
              'À lire'
            ],

            datasets: [
              {
                data: [
                  data.totalBooksRead,
                  data.currentlyReading,
                  data.wantToRead
                ],

                backgroundColor: [
                  '#22c55e',
                  '#f59e0b',
                  '#3b82f6'
                ],

                borderWidth: 0,
                hoverOffset: 12
              }
            ]
          };
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  /* =====================================================
      GENRES
  ===================================================== */

 loadGenreStats(userId: number): void {

  this.statisticsService
    .getGenres(userId)
    .subscribe({

      next: (data: any[]) => {

        console.log('Genres:', data);

        this.genreChart = {

          ...this.genreChart,

          series: data.map(x => Number(x.total)),

          labels: data.map(x => x.label)
        };
      },

      error: (err) => {
        console.error(err);
      }
    });
}

  /* =====================================================
      AUTHORS
  ===================================================== */

loadAuthorStats(userId: number): void {

  this.statisticsService
    .getAuthors(userId)
    .subscribe({

      next: (data: any[]) => {

        console.log('Authors:', data);

        this.authorChart = {

          ...this.authorChart,

          series: [
            {
              name: 'Livres',

              data: data.map(x => Number(x.total))
            }
          ],

          xaxis: {
            categories: data.map(x => x.label)
          }
        };
      },

      error: (err) => {
        console.error(err);
      }
    });
}
  /* =====================================================
      MONTHLY STATS
  ===================================================== */

loadMonthlyStats(userId: number): void {

  this.statisticsService
    .getMonthlyStats(userId)
    .subscribe({

      next: (data: any[]) => {

        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ];

        const monthlyData = new Array(12).fill(0);

        data.forEach(item => {

          const index = months.indexOf(item.month);

          if (index !== -1) {
            monthlyData[index] = item.total;
          }
        });

        this.monthlyReadingChart = {

          ...this.monthlyReadingChart,

          series: [
            {
              name: 'Livres lus',
              data: monthlyData
           }
          ],

          xaxis: {
            categories: months
          }
        };
      }
    });
}


loadYearlyGoal(): void {

  this.goalService.getGoals()
    .subscribe({

      next: (goals: any[]) => {

        // OBJECTIF ANNUEL LIVRES
        const yearlyBookGoal = goals.find(

          g =>

            g.period === 'YEARLY' &&
            g.metric === 'BOOKS'
        );

        if (yearlyBookGoal) {

          this.yearlyGoal =
            yearlyBookGoal.targetValue;

          this.yearlyGoalProgress =
            this.calculateGoalPercentage(
              yearlyBookGoal
            );

          // UPDATE CHART
          this.goalChart = {

            ...this.goalChart,

            series: [
              this.yearlyGoalProgress
            ]
          };
        }
      },

      error: (err) => {
        console.error(err);
      }

    });
}
  /* =====================================================
      GOAL %
  ===================================================== */

  calculateGoalPercentage(goal: any): number {

  if (!goal?.targetValue) {
    return 0;
  }

  const percent =

    (goal.currentValue / goal.targetValue)
    * 100;

  return Math.min(
    Math.round(percent),
    100
  );
}

  /* =====================================================
      CHART JS DATA
  ===================================================== */

  doughnutChartData:
    ChartConfiguration<'doughnut'>['data'] = {

    labels: [],

    datasets: []
  };

  barChartData:
    ChartConfiguration<'bar'>['data'] = {

    labels: [],

    datasets: []
  };

  authorChartData:
    ChartConfiguration<'bar'>['data'] = {

    labels: [],

    datasets: []
  };

  lineChartData:
    ChartConfiguration<'line'>['data'] = {

    labels: [],

    datasets: []
  };

  /* =====================================================
      OPTIONS
  ===================================================== */

  doughnutChartOptions:
    ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        position: 'bottom'
      }
    }
  };

  barChartOptions:
    ChartOptions<'bar'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }
    },

    scales: {

      y: {

        beginAtZero: true,

        grid: {
          color: '#e2e8f0'
        }
      },

      x: {

        grid: {
          display: false
        }
      }
    }
  };

  lineChartOptions:
    ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: true
      }
    },

    scales: {

      y: {

        beginAtZero: true,

        grid: {
          color: '#e2e8f0'
        }
      },

      x: {

        grid: {
          display: false
        }
      }
    }
  };

}