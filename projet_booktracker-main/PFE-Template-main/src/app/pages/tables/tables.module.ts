import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TablesRoutes } from './tables.routing';

// tables components
import { AppBasicTableComponent } from './basic-table/basic-table.component';
import { AppMixTableComponent } from './mix-table/mix-table.component';
import { AppPaginationTableComponent } from './pagination-table/pagination-table.component';
import { AppSelectionTableComponent } from './selection-table/selection-table.component';
import { AppSortableTableComponent } from './sortable-table/sortable-table.component';
import { AppStickyColumnTableComponent } from './sticky-column-table/sticky-column-table.component';
import { AppFilterableTableComponent } from './filterable-table/filterable-table.component';

@NgModule({
  imports: [
    RouterModule.forChild(TablesRoutes),

    AppBasicTableComponent,
    AppMixTableComponent,
    AppPaginationTableComponent,
    AppSelectionTableComponent,
    AppSortableTableComponent,
    AppStickyColumnTableComponent,
    AppFilterableTableComponent,
  ],
  declarations: [],
})
export class TablesModule {}
