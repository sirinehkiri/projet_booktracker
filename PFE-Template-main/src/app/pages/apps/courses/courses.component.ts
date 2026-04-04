import { Component } from '@angular/core';
import { CourseService } from './course.service';
import { course } from './course';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogOverviewComponent } from '../../ui-components/dialog/dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class AppCoursesComponent {
  courseList: course[] = [];
  selectedCategory = 'All';

  constructor(public dialog: MatDialog,private courseService: CourseService) {
    this.courseList = this.courseService.getCourse();
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(AppDialogOverviewComponent, {
      width: '900px',
      height:'400px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
  
  
 applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.courseList = this.filter(filterValue);
  }

  filter(v: string): course[] {
    return this.courseService
      .getCourse()
      .filter((x) => x.courseFramework.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

   /*ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.courseList = this.courseService.getCourse();
    } else {
      this.courseList = this.courseService
        .getCourse()
        // tslint:disable-next-line: no-shadowed-variable
        .filter((course) => course.courseFramework === filterValue);
    }
    // this.todos.filter(course => course.courseType==filterValue);
  }*/
}
