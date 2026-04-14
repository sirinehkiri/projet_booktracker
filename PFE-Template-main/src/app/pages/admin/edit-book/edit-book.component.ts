import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/pages/blogs/book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html'
})
export class EditBookComponent implements OnInit {

  form!: FormGroup;
  id!: number;

  oldImage: string = '';     // ancienne image
  previewImage: string = ''; // nouvelle image (URL)

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      year: ['', Validators.required],
      langue: ['', Validators.required],
      total_pages: ['', Validators.required],
      description: ['']
    });

    this.bookService.getBook(this.id).subscribe((book:any) => {

      this.form.patchValue(book);

      this.oldImage = book.pic;       // ancienne
      this.previewImage = '';         // pas encore changé

    });
  }

  // upload image → récup URL
  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      this.bookService.uploadImage(formData).subscribe((res:any) => {

        this.previewImage = res.url; // nouvelle image

      });
    }
  }

  updateBook() {

    const bookData = {
      ...this.form.value,
      pic: this.previewImage || this.oldImage // ⚠️ important
    };

    this.bookService.updateBook(this.id, bookData).subscribe({
      next: () => {
        alert("Book updated!");
        this.router.navigate(['/apps/blog/post']);
      },
      error: err => {
        console.error(err);
        alert("Error updating book!");
      }
    });

  }

}