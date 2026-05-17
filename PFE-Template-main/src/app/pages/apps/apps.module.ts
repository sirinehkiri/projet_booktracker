import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RecommendationsComponent } from './contact/recommendations.component';
// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Chat
import { AppChatComponent } from './chat/chat.component';
//Contact
import { AppContactDialogContentComponent } from './contact/contact.component';
import { AppContactComponent } from './contact/contact.component';
//Notes
import { AppNotesComponent } from './notes/notes.component';
//Todo
import { ReadingGoalComponent } from './reading-goal/reading-goal.component';

//Calendar
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppEmployeeComponent } from './employee/employee.component';
import { AppEmployeeDialogContentComponent } from './employee/employee.component';
import { AppAddEmployeeComponent } from './employee/add/add.component';

import { AppsRoutes } from './apps.routing';
import { MatNativeDateModule } from '@angular/material/core';
import {
  AppTicketlistComponent,
  AppTicketDialogContentComponent,
} from './ticketlist/ticketlist.component';
// blog
import { AppBlogsComponent } from '../blogs/blogs.component';
import { AppBlogDetailsComponent } from '../blogs/details/details.component';

//profile
import { ProfileComponent } from './profil/profile.component';

// ---> LES IMPORTS JDOD LI ZEDNEHOM <---
import { MyBookListsComponent } from './my-book-lists/my-book-lists.component';
import { PreferencesComponent } from './preferences/preferences.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AppsRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forRoot(),
    NgApexchartsModule,
    TablerIconsModule.pick(TablerIcons),
    DragDropModule,
    NgxPaginationModule,
    HttpClientModule,
    AngularEditorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatNativeDateModule,
    NgScrollbarModule,
    ProfileComponent, 
  ],
  exports: [TablerIconsModule],
  declarations: [
    AppChatComponent,
    AppNotesComponent,
    ReadingGoalComponent,
    AppTicketlistComponent,
    AppTicketDialogContentComponent,
    AppContactComponent,
    AppContactDialogContentComponent,
    AppEmployeeComponent,
    AppEmployeeDialogContentComponent,
    AppAddEmployeeComponent,
    AppBlogsComponent,
    AppBlogDetailsComponent,
    RecommendationsComponent,
    PreferencesComponent,
    
    // ---> LES COMPOSANTS JDOD LI ZEDNEHOM HOUNI <---
    MyBookListsComponent,
    
  ],
  providers: [DatePipe],
})
export class AppsModule {}