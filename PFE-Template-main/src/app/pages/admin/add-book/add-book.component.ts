import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from 'src/app/pages/blogs/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html'
})

export class AddBookComponent {

  step1!:FormGroup;
  step2!:FormGroup;

  previewImage:any;

  constructor(
    private fb:FormBuilder,
    private bookService:BookService,
    private router:Router
  ){

    this.step1=this.fb.group({
      title:['',Validators.required],
      author:['',Validators.required],
      genre:[''],
      year:[''],
      langue:[''],
      total_pages:['']
    });

    this.step2=this.fb.group({
      description:['']
    });

  }

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    this.bookService.uploadImage(formData).subscribe((url:any)=>{
  this.previewImage = url.url;
   });
  }
}

  addBook() {
  if (!this.previewImage) {
    alert("Please upload an image first!");
    return;
  }

  const bookData = {
    ...this.step1.value,
    ...this.step2.value,
    pic: this.previewImage
  };

  this.bookService.addBook(bookData).subscribe({
    next: () => {
      alert("Book added!");
      this.router.navigate(['/apps/blog']);
    },
    error: err => {
      console.error(err);
      alert("Error adding book!");
    }
  });
}

}