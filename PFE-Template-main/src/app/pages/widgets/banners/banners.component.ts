import { Component } from '@angular/core';
import { MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html'
})
export class AppBannersComponent {
  verticalPosition1: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition2: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition3: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition4: MatSnackBarVerticalPosition = 'bottom';
  verticalPosition5: MatSnackBarVerticalPosition = 'bottom';
  disabled = false;
  max = 500;
  min = 0;
  value = 0;


  constructor() { }

}
