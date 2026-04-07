import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { ChartsRoutes } from './charts.routing';
import { AppDoughnutpieChartComponent } from './doughnut-pie/doughnut-pie.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ChartsRoutes),
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),
    AppDoughnutpieChartComponent
  ],
  exports: [TablerIconsModule],
})
export class ChartsModule {}
