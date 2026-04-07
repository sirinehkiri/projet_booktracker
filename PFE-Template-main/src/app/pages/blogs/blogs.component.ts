import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from './book.service';
import { Book } from './book.model';

@Component({
  selector:'app-blogs',
  templateUrl:'./blogs.component.html',
  styleUrls:['./blogs.component.scss']
})

export class AppBlogsComponent implements OnInit {

  books: Book[] = []; 

  constructor(
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(){
  this.bookService.getBooks().subscribe(data=>{
    console.log("BOOKS:", data);
    this.books = data;
  });
}

  goToDetail(book: Book){
    this.router.navigate(['apps/blog/detail', book.id]);
  }

  editBook(id:number){
 this.router.navigate(['/admin/edit-book',id])
}

deleteBook(id:number){

 if(confirm("Delete book?")){
  this.bookService.deleteBook(id).subscribe(()=>{
   this.loadBooks();
  })
 }

}
goToAdd(){
  this.router.navigate(['/admin/add-book']);
}

}