import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router,private authService: AuthService) { }

  form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;

  this.authService.login(this.form.value).subscribe({
  next: (res: any) => {
    console.log('SUCCESS:', res);
    alert(res.message || 'Connexion réussie');

    localStorage.setItem('token', res.token);

    this.router.navigate(['/apps/notes']);
  },
  error: (err) => {
    if (err.error?.message) {
      alert(err.error.message);
    } else {
      alert("Erreur serveur");
    }
  }
});
}
}
