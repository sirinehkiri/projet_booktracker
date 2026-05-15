import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PagesRoutes } from './pages.routing.module';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MatCardModule,
    RouterModule.forChild(PagesRoutes)
  ],
})
export class PagesModule {}
