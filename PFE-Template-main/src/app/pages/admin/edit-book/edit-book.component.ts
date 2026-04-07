import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { BookService } from 'src/app/pages/blogs/book.service';

@Component({
  selector:'app-edit-book',
  templateUrl:'./edit-book.component.html'
})

export class EditBookComponent implements OnInit{

  book:any={}
  id:any

  constructor(
    private route:ActivatedRoute,
    private bookService:BookService,
    private router:Router
  ){}

  ngOnInit(){

    this.id=this.route.snapshot.params['id'];

    this.bookService.getBook(this.id).subscribe(data=>{
      this.book=data;
    });

  }

  updateBook(){

  const formData = new FormData();

  formData.append('title', this.book.title);
  formData.append('author', this.book.author);
  formData.append('genre', this.book.genre);
  formData.append('year', this.book.year);
  formData.append('langue', this.book.langue);
  formData.append('total_pages', this.book.total_pages);
  formData.append('description', this.book.description);

  if(this.selectedFile){
    formData.append('image', this.selectedFile);
  }

  this.bookService.updateBook(this.id, formData).subscribe({
    next: () => {
      alert("Book updated !");
      this.router.navigate(['/apps/blog']);
    },
    error: err => {
      console.error(err);
      alert("Erreur update !");
    }
  });

}
  previewImage: string | ArrayBuffer | null = null;
selectedFile!: File;

onFileSelected(event:any){
  const file = event.target.files[0];
  if(file){
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

}