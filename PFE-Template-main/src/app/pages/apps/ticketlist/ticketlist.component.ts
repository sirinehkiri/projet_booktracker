import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

export interface BookElement {
  id: number;
  title: string;
  author: string;
  genre: string;
  pic: string;
  status: string;
  progress: number;
}

const books: BookElement[] = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self Development',
    pic: '/assets/images/books/book1.jpg',
    status: 'reading',
    progress: 65,
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Programming',
    pic: '/assets/images/books/book2.jpg',
    status: 'completed',
    progress: 100,
  },
  {
    id: 3,
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    genre: 'Finance',
    pic: '/assets/images/books/book3.jpg',
    status: 'wishlist',
    progress: 0,
  },
];

@Component({
  selector: 'app-my-books',
  templateUrl: './ticketlist.component.html',
})
export class MyBooksComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  totalBooks = 0;
  readingBooks = 0;
  completedBooks = 0;
  wishlistBooks = 0;

  displayedColumns: string[] = [
    'cover',
    'title',
    'genre',
    'status',
    'progress',
    'action',
  ];

  dataSource = new MatTableDataSource<BookElement>(books);

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.totalBooks = books.length;

    this.readingBooks = books.filter(
      (b) => b.status === 'reading'
    ).length;

    this.completedBooks = books.filter(
      (b) => b.status === 'completed'
    ).length;

    this.wishlistBooks = books.filter(
      (b) => b.status === 'wishlist'
    ).length;

    this.dataSource.filterPredicate = (
      data: BookElement,
      filter: string
    ) => {
      return (
        data.title.toLowerCase().includes(filter) ||
        data.author.toLowerCase().includes(filter) ||
        data.genre.toLowerCase().includes(filter)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  filterStatus(status: string): void {
    if (status === '') {
      this.dataSource.data = books;
    } else {
      this.dataSource.data = books.filter(
        (b) => b.status === status
      );
    }
  }
}