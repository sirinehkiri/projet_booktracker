import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserBookService } from 'src/app/services/user-book.service';
import { UserBook } from './ticket';

@Component({
  selector: 'app-my-books',
  templateUrl: './ticketlist.component.html',
  styleUrls: ['./ticketlist.component.scss'],
})
export class MyBooksComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
  'cover',
  'title',
  'genre',
  'status',
  'progress',
  'pages',
  'finishDate',
  'action',
];

  dataSource = new MatTableDataSource<UserBook>([]);

  books: UserBook[] = [];

  totalBooks = 0;
  readingBooks = 0;
  completedBooks = 0;
  wishlistBooks = 0;

  constructor(private userBookService: UserBookService ,
  private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadBooks();
    this.dataSource.filterPredicate = (
  data: UserBook,
  filter: string
): boolean => {

  const search = `
    ${data.book?.title}
    ${data.book?.author}
    ${data.book?.genre}
    ${data.status}
  `.toLowerCase();

  return search.includes(filter);
};
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadBooks(): void {
    const user = localStorage.getItem('user');

  if (!user) {
    console.error('User not found');
    return;
  }

  const parsedUser = JSON.parse(user);

  const userId = parsedUser.id;

  if (!userId) {
    console.error('User ID not found');
    return;
  }

    this.userBookService
      .getUserBooks(Number(userId))
      .subscribe({
        next: (response) => {
          this.books = response.map((book) => {
          const progress =
            book.totalPages > 0
              ? Math.min(
                  (book.pagesRead / book.totalPages) * 100,
                  100
                )
              : 0;

          return {
            ...book,
            progress: Number(progress.toFixed(0)),
          };
        });

        this.dataSource.data = this.books;
          this.calculateStats();
        },
        error: (err) => {
          console.error(err);
        },
      });
      console.log(this.books)
  }

  calculateStats(): void {

  this.totalBooks = this.books.length;

  this.readingBooks = this.books.filter(
    (b) => b.status === 'READING'
  ).length;

  this.completedBooks = this.books.filter(
    (b) => b.status === 'READ'
  ).length;

  this.wishlistBooks = this.books.filter(
    (b) => b.status === 'WANT_TO_READ'
  ).length;
}

  applyFilter(value: string): void {
    this.dataSource.filter = value
      .trim()
      .toLowerCase();
  }

  filterStatus(status: string): void {
    if (status === '') {
       this.dataSource.data = this.books;
    } else {
      this.dataSource.data = this.books.filter(
        (b) =>
          b.status.toLowerCase() ===
          status.toLowerCase()
      );
    }
  }

deleteBook(id: number): void {

  if (!confirm('Delete this book ?')) {
    return;
  }

  this.userBookService
    .deleteBook(id)
    .subscribe({

      next: () => {

        this.books = this.books.filter(
          (b) => b.id !== id
        );

        this.dataSource.data = this.books;

        this.calculateStats();

        this.showMessage(
          'Book deleted successfully'
        );
      },

      error: (err) => {

        console.error(err);

        this.showMessage(
          'Error deleting book'
        );
      },

    });
}

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