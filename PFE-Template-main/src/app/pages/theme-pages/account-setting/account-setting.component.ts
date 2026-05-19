import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppAccountSettingComponent
implements OnInit {

  profileForm!: FormGroup;

  previewImage: string | ArrayBuffer | null = null;

  selectedFile!: File;

  loading = false;

  saving = false;

  user: any;
  passwordForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    this.initializeForm();
  }

  // ======================================================
  // FORM
  // ======================================================

  initializeForm(): void {

    this.profileForm = this.fb.group({

      username: [
        this.user?.username || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ]
      ]
    });

    this.passwordForm = this.fb.group({

  currentPassword: [
    '',
    Validators.required
  ],

  newPassword: [
    '',
    [
      Validators.required,
      Validators.minLength(6)
    ]
  ]

});
  }

  // ======================================================
  // HEADERS
  // ======================================================

  private getHeaders() {

    const token =
      localStorage.getItem('token');

    return {

      headers: new HttpHeaders({

        Authorization:
          `Bearer ${token}`
      })
    };
  }

  // ======================================================
  // FILE SELECT
  // ======================================================

  onFileSelected(event: any): void {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // FILE VALIDATION
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.showMessage(
        'Invalid image format'
      );

      return;
    }

    // 5MB MAX
    if (file.size > 5 * 1024 * 1024) {

      this.showMessage(
        'Image must be less than 5MB'
      );

      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.previewImage = reader.result;

      this.cdr.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  // ======================================================
  // RESET IMAGE
  // ======================================================

  resetImage(): void {

    this.previewImage = null;

    this.selectedFile = null as any;

    this.cdr.markForCheck();
  }

  // ======================================================
  // UPDATE PROFILE
  // ======================================================

  updateProfile(): void {

    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();

      return;
    }

    this.saving = true;

    const formData = new FormData();

    formData.append(

      'data',

      new Blob(

        [
          JSON.stringify({

            username:
              this.profileForm.value.username
          })
        ],

        {
          type: 'application/json'
        }
      )
    );

    if (this.selectedFile) {

      formData.append(
        'image',
        this.selectedFile
      );
    }

    this.http.put(

      'http://localhost:8081/api/users/profile',

      formData,

      this.getHeaders()

    ).subscribe({

      next: (res: any) => {

        this.saving = false;

        localStorage.setItem(
          'token',
          res.token
        );

        // UPDATE LOCAL USER
        const user = JSON.parse(
          localStorage.getItem('user') || '{}'
        );

        user.username = res.username;

        user.image = res.image;

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        this.user = user;

        this.showMessage(
          'Profile updated successfully'
        );

        this.cdr.markForCheck();
      },

      error: (err) => {

        console.error(err);

        this.saving = false;

        this.showMessage(
          'Failed to update profile'
        );

        this.cdr.markForCheck();
      }
      

    });
  }

  // ======================================================
  // PROFILE IMAGE
  // ======================================================

  getProfileImage(): string {

    if (this.previewImage) {

      return this.previewImage as string;
    }

    if (this.user?.image) {

      return `http://localhost:8081/uploads/${this.user.image}`;
    }

    return '/assets/images/profile/user-1.jpg';
  }


  changePassword(): void {

  if (this.passwordForm.invalid) {

    this.passwordForm.markAllAsTouched();

    return;
  }

  this.http.put(

    'http://localhost:8081/api/users/change-password',

    this.passwordForm.value,

    this.getHeaders()

  ).subscribe({

    next: () => {

      this.showMessage(
        'Password updated successfully'
      );

      this.passwordForm.reset();

      this.cdr.markForCheck();
    },

    error: (err) => {

      console.error(err);

      this.showMessage(
        'Failed to update password'
      );
    }

  });
}

  // ======================================================
  // HELPERS
  // ======================================================

  showMessage(message: string): void {

    this.snackBar.open(
      message,
      'Close',
      {
        duration: 3000
      }
    );
  }
}