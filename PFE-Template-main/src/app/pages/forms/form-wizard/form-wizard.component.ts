import { Component} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
  
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, TablerIconsModule],
  templateUrl: './form-wizard.component.html',
})
export class AppFormWizardComponent{
  
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  hide = true;
  hide2 = true;
  conhide = true;
  alignhide = true;

  

  // 3 accordian
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
