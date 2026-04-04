import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-boxed-register',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './boxed-register.component.html',
})
export class AppBoxedRegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router,private authService: AuthService) { }

  form = new FormGroup({
  username: new FormControl('', [Validators.required, Validators.minLength(6)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required]),
});

  get f() {
    return this.form.controls;
  }

  submit() {
  if (this.form.invalid) return;

  this.authService.register(this.form.value).subscribe({
  next: (res: any) => {
    console.log('SUCCESS:', res);

    alert(res.message || 'Compte créé avec succès');

    this.router.navigate(['/authentication/side-login']);
  },

  error: (err) => {
    console.log("FULL ERROR:", err);
    console.log("ERROR BODY:", err.error);
    if (err.error?.message) {
        alert(err.error.message);
      } else {
        alert("Erreur serveur");
      }
  }
});
}
}
