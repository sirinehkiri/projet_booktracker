import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Book{
  title:string
  author:string
  rating:number
  votes:string
  id:number
}

interface BookList{
  title:string
  total:number
  voters:number
  books:Book[]
}

@Component({
  selector:'app-blogs',
  templateUrl:'./blogs.component.html',
  styleUrls:['./blogs.component.scss']
})

export class AppBlogsComponent{

  constructor(private router: Router){}

  lists:BookList[]=[

    {
      title:"Goodreads Editors' Picks for 2026",
      total:36,
      voters:1,
      books:[
        {id:1,title:"The Age of Calamities",author:"Senaa Ahmad",rating:3.4,votes:"503"},
        {id:2,title:"Escape!",author:"Stephen Fishbach",rating:3.75,votes:"2,811"},
        {id:3,title:"Is This a Cry for Help?",author:"Emily R. Austin",rating:4.03,votes:"7,836"},
        {id:4,title:"Just Watch Me",author:"Lior Torenberg",rating:3.62,votes:"3,075"},
        {id:5,title:"The School of Night",author:"Karl Ove Knausgård",rating:4.38,votes:"4,396"}
      ]
    }

  ]

  /* NAVIGATION */
  goToDetail(book: Book){
  this.router.navigate(['apps/blog/detail', book.id]);
}

}