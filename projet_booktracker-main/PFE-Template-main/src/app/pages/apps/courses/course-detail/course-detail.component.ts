import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { course } from '../course';
import { CourseService } from '../course.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss'],
})
export class AppCourseDetailComponent {
  id: any;
  courseDetail: course;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder,activatedRouter: ActivatedRoute, courseService: CourseService) {
    this.id = activatedRouter?.snapshot?.paramMap?.get('id');
    this.courseDetail = courseService.getCourse().filter((x) => x?.Id === +this.id)[0];
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  panelOpenState = false;
}
