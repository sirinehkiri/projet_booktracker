import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from './book.service';
import { AuthService } from '../authentication/auth.service';
import { Book } from './book.model';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class AppBlogsComponent implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  books: Book[] = [];
  trendingBooks: Book[] = [];
  recentBooks: Book[] = [];
  genreBooks: Book[] = [];
  recommendedBooks: Book[] = [];
  genres: string[] = [];
  selectedGenre = '';

  // =====================================================
  // TABS
  // =====================================================

  activeTab:
    'all' | 'trending' | 'recent' |
    'genre' | 'recommended' = 'all';

  // =====================================================
  // SEARCH
  // =====================================================

  keyword = '';
  showAdvanced = false;
  searched = false;
  loading = false;
  searchResults: Book[] = [];

  filters = {
    title: '',
    author: '',
    genre: '',
    year: null as number | null
  };

  constructor(
    private router: Router,
    private bookService: BookService,
    public authService: AuthService
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.loadBooks();
    this.loadGenres();
    this.loadTrending();
    this.loadRecent();
    this.loadRecommendations();
  }

  // =====================================================
  // DISPLAYED BOOKS
  // =====================================================

  get displayedBooks(): Book[] {

    if (this.searched) {
      return this.searchResults;
    }

    switch (this.activeTab) {
      case 'trending':
        return this.trendingBooks;
      case 'recent':
        return this.recentBooks;
      case 'genre':
        return this.genreBooks;
      case 'recommended':
        return this.recommendedBooks;
      default:
        return this.books;
    }
  }

  // =====================================================
  // LOAD DATA
  // =====================================================

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (data: Book[]) => {
        this.books = data || [];
      },
      error: (err: any) =>
        console.error('Error loading books', err)
    });
  }

  loadGenres(): void {
    this.bookService.getAllGenres().subscribe({
      next: (data: string[]) => {
        this.genres = data || [];
      },
      error: (err: any) =>
        console.error('Error loading genres', err)
    });
  }

  loadTrending(): void {
    this.bookService.getTrendingBooks().subscribe({
      next: (data: Book[]) => {
        this.trendingBooks = data || [];
      },
      error: (err: any) =>
        console.error('Error loading trending', err)
    });
  }

  loadRecent(): void {
    this.bookService.getRecentlyAdded().subscribe({
      next: (data: Book[]) => {
        this.recentBooks = data || [];
      },
      error: (err: any) =>
        console.error('Error loading recent', err)
    });
  }

  // =====================================================
  // ✅ LOAD RECOMMENDATIONS
  // =====================================================

  loadRecommendations(): void {
    this.bookService.getRecommendations().subscribe({
      next: (data: Book[]) => {
        this.recommendedBooks = data || [];
      },
      error: (err: any) =>
        console.error(
          'Error loading recommendations',
          err
        )
    });
  }

  // =====================================================
  // TABS
  // =====================================================

  setTab(
    tab: 'all' | 'trending' | 'recent' |
         'genre' | 'recommended'
  ): void {
    this.activeTab = tab;
    this.searched = false;
    this.keyword = '';
    this.loading = false;
  }

  // =====================================================
  // GENRE
  // =====================================================

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.activeTab = 'genre';
    this.searched = false;
    this.loading = true;

    this.bookService
      .getBooksByGenre(genre)
      .subscribe({
        next: (data: Book[]) => {
          this.genreBooks = data || [];
          this.loading = false;
        },
        error: (err: any) => {
          console.error(
            'Error loading genre',
            err
          );
          this.loading = false;
        }
      });
  }

  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(): void {

    if (!this.keyword.trim()) {
      this.resetSearch();
      return;
    }

    this.loading = true;
    this.searched = false;

    this.bookService
      .searchBooks(this.keyword)
      .subscribe({
        next: (data: Book[]) => {
          this.searchResults = data || [];
          this.loading = false;
          this.searched = true;
        },
        error: (err: any) => {
          console.error('Search error', err);
          this.loading = false;
          this.searched = true;
        }
      });
  }

  onAdvancedSearch(): void {

    this.loading = true;
    this.searched = false;

    this.bookService.advancedSearch({
      title:  this.filters.title  || undefined,
      author: this.filters.author || undefined,
      genre:  this.filters.genre  || undefined,
      year:   this.filters.year   || undefined
    }).subscribe({
      next: (data: Book[]) => {
        this.searchResults = data || [];
        this.loading = false;
        this.searched = true;
      },
      error: (err: any) => {
        console.error(
          'Advanced search error',
          err
        );
        this.loading = false;
        this.searched = true;
      }
    });
  }

  resetSearch(): void {
    this.keyword = '';
    this.searched = false;
    this.loading = false;
    this.searchResults = [];
    this.filters = {
      title: '',
      author: '',
      genre: '',
      year: null
    };
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  goToDetail(book: Book): void {
    this.router.navigate(
      ['apps/blog/detail', book.id]
    );
  }

  editBook(id: number): void {
    this.router.navigate(
      ['/admin/edit-book', id]
    );
  }

  deleteBook(id: number): void {
    if (confirm('Delete book?')) {
      this.bookService
        .deleteBook(id)
        .subscribe(() => {
          this.loadBooks();
          this.loadTrending();
          this.loadRecent();
          this.loadRecommendations();
        });
    }
  }

  goToAdd(): void {
    this.router.navigate(['/admin/add-book']);
  }

  
}