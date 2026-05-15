import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { BaseChartDirective } from 'ng2-charts';

import { DashboardsRoutes } from './dashboards.routing';
import { StatisticsComponent } from './dashboard1/dashboard1.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexTooltip
} from 'ng-apexcharts';

@NgModule({
  declarations: [
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    NgApexchartsModule,
    BaseChartDirective,
    RouterModule.forChild(DashboardsRoutes)
  ]
})
export class DashboardsModule {}