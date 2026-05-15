import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatNativeDateModule } from '@angular/material/core';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { ThemePagesRoutes } from './theme-pages.routing';

// theme pages
import { AppAccountSettingComponent } from './account-setting/account-setting.component';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppAccountSettingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ThemePagesRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule.pick(TablerIcons),
    MatNativeDateModule,
    MatCardModule,
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
})
export class ThemePagesModule {}
