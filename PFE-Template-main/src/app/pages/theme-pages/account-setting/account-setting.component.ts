import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
})
export class AppAccountSettingComponent {

  username: string = '';
  previewImage: string | ArrayBuffer | null = null;
  selectedFile!: File;

  constructor(private http: HttpClient) {}
     private getHeaders(){
        const token = localStorage.getItem("token");
    
        return {
          headers: new HttpHeaders({
            Authorization:`Bearer ${token}`
          })
        };
      }

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (file) {

      this.selectedFile = file;

      const reader = new FileReader();

      reader.onload = () => {
        this.previewImage = reader.result;
      };

      reader.readAsDataURL(file);
    }
  }

  resetImage() {
    this.previewImage = null;
  }

  updateProfile() {

    const formData = new FormData();

    formData.append(
      'data',
      new Blob(
        [JSON.stringify({
          username: this.username
        })],
        { type: 'application/json' }
      )
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.put(
      'http://localhost:8081/api/users/profile',
      formData,this.getHeaders()
    ).subscribe({

      next: (res: any) => {

        console.log(res);

        alert('Profil mis à jour');

        // mise à jour localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        user.username = res.username;
        user.image = res.image;

        localStorage.setItem('user', JSON.stringify(user));
      },

      error: (err: any) => {
        console.log(err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }
  getProfileImage(): string {

  if (this.previewImage) {
    return this.previewImage as string;
  }

  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );

  if (user.image) {
    return `http://localhost:8081/uploads/${user.image}`;
  }

  return '/assets/images/profile/user-1.jpg';
}
}