import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BookListService } from '../../../services/book-list.service';

@Component({
  selector: 'app-my-book-lists',
  templateUrl: './my-book-lists.component.html',
  styleUrls: ['./my-book-lists.component.scss']
})
export class MyBookListsComponent implements OnInit {
  lists: any[] = [];
  newListName: string = '';
  newListDesc: string = '';
  message: string = '';
  loading: boolean = true;

  editingListId: number | null = null;
  editName: string = '';
  editDesc: string = '';

  selectedList: any = null;
  allBooks: any[] = [];
  booksInList: any[] = [];
  searchTerm: string = '';
  sortBy: string = 'custom';
  loadingDetail: boolean = false;

  private get STORAGE_KEY(): string {
    const userId = this.getUserIdFromToken();
    return `mbl_selected_list_${userId}`;
  }

  constructor(
    private bookListService: BookListService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('🚀 ngOnInit');
    this.loadLists();
  }

  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return 'anonymous';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || 'anonymous';
    } catch (e) {
      return 'anonymous';
    }
  }

  loadLists(): void {
    this.loading = true;
    this.bookListService.getUserLists().subscribe({
      next: (data) => {
        console.log('✅ Lists received:', data.length, data);

        if (data.length === 0) {
          console.log('🎁 Creating default lists...');
          this.bookListService.initDefaultLists().subscribe({
            next: () => this.loadLists(),
            error: () => this.loading = false
          });
        } else {
          this.lists = data;
          this.loading = false;
          setTimeout(() => this.restoreSelectedList(), 200);
        }
      },
      error: (err) => {
        console.error('❌ Loading error:', err);
        this.loading = false;
      }
    });
  }

  restoreSelectedList(): void {
    const saved = sessionStorage.getItem(this.STORAGE_KEY) || localStorage.getItem(this.STORAGE_KEY);
    console.log('🔄 Restore - saved ID:', saved);

    if (!saved) return;

    const id = Number(saved);
    const list = this.lists.find(l => l.id === id);

    if (list) {
      console.log('✅ Restoring list:', list.name);
      this.openList(list, false);
    } else {
      sessionStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  createList(): void {
    if (!this.newListName.trim()) {
      alert('❌ Name is required!');
      return;
    }

    this.bookListService.createList({
      name: this.newListName.trim(),
      description: this.newListDesc.trim()
    }).subscribe({
      next: (newList) => {
        this.lists.push(newList);
        this.newListName = '';
        this.newListDesc = '';
        this.showMessage('✅ List created!');
      },
      error: (err) => this.showMessage('❌ ' + (err.error?.message || err.message))
    });
  }

  openList(list: any, shouldScroll: boolean = true): void {
    console.log('📂 Opening list:', list.name, 'ID:', list.id);

    this.selectedList = list;
    this.loadingDetail = true;
    this.searchTerm = '';
    this.sortBy = 'custom';
    this.allBooks = [];
    this.booksInList = [];

    const idStr = String(list.id);
    sessionStorage.setItem(this.STORAGE_KEY, idStr);
    localStorage.setItem(this.STORAGE_KEY, idStr);

    this.loadAllBooks();
    this.loadBooksInList();

    if (shouldScroll) {
      setTimeout(() => {
        document.getElementById('detail-panel')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  closeDetail(): void {
    this.selectedList = null;
    this.allBooks = [];
    this.booksInList = [];
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  loadAllBooks(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    this.http.get<any[]>('http://localhost:8081/books', { headers }).subscribe({
      next: (books) => {
        console.log('📚 All books:', books.length);
        this.allBooks = books;
      },
      error: () => this.allBooks = []
    });
  }

  loadBooksInList(): void {
    if (!this.selectedList) return;

    console.log('🔍 GET books for list:', this.selectedList.name, 'ID:', this.selectedList.id);

    this.bookListService.getBooksInList(this.selectedList.id).subscribe({
      next: (books) => {
        console.log('📖 Backend returns for', this.selectedList.name, ':', books?.length || 0, 'books');
        this.booksInList = books || [];
        this.loadingDetail = false;
      },
      error: (err) => {
        console.error('❌ Books error:', err);
        this.booksInList = [];
        this.loadingDetail = false;
      }
    });
  }

  isInList(bookId: number): boolean {
    return this.booksInList.some(b => b.id === bookId);
  }

  addBook(book: any): void {
    console.log('➕ ADD book:', book.title, '→ List:', this.selectedList.name, '(ID:', this.selectedList.id, ')');

    this.bookListService.addBookToList(this.selectedList.id, book.id).subscribe({
      next: () => {
        this.booksInList.push(book);
        this.showMessage(`✅ "${book.title}" added to ${this.selectedList.name}!`);
        setTimeout(() => this.loadBooksInList(), 500);
      },
      error: (err) => {
        console.error('❌ Add error:', err);
        this.showMessage('❌ ' + (err.error?.message || err.message));
      }
    });
  }

  removeBook(book: any): void {
    if (!confirm(`Remove "${book.title}" ?`)) return;

    this.bookListService.removeBookFromList(this.selectedList.id, book.id).subscribe({
      next: () => {
        this.booksInList = this.booksInList.filter(b => b.id !== book.id);
        this.showMessage(`🗑️ "${book.title}" removed`);
      }
    });
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.booksInList, event.previousIndex, event.currentIndex);
    const orderedIds = this.booksInList.map(b => b.id);

    this.bookListService.reorderBooks(this.selectedList.id, orderedIds).subscribe({
      next: () => this.showMessage('🔀 Order saved!'),
      error: () => this.showMessage('⚠️ Order changed locally only')
    });
  }

  sortBooks(): any[] {
    const books = [...this.booksInList];
    if (this.sortBy === 'title') {
      return books.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (this.sortBy === 'author') {
      return books.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
    }
    return books;
  }

  filteredBooks(): any[] {
    if (!this.searchTerm.trim()) return this.allBooks;
    const term = this.searchTerm.toLowerCase();
    return this.allBooks.filter(b =>
      b.title?.toLowerCase().includes(term) ||
      b.author?.toLowerCase().includes(term)
    );
  }

  startEdit(list: any, event: Event): void {
    event.stopPropagation();
    this.editingListId = list.id;
    this.editName = list.name;
    this.editDesc = list.description || '';
  }

  cancelEdit(event: Event): void {
    event.stopPropagation();
    this.editingListId = null;
  }

  saveEdit(listId: number, event: Event): void {
    event.stopPropagation();
    if (!this.editName.trim()) return;

    this.bookListService.updateList(listId, {
      name: this.editName.trim(),
      description: this.editDesc.trim()
    }).subscribe({
      next: (updated) => {
        const index = this.lists.findIndex(l => l.id === listId);
        if (index !== -1) this.lists[index] = updated;
        this.editingListId = null;
        this.showMessage('✅ Updated!');
      }
    });
  }

  deleteList(listId: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Delete this list?')) return;

    this.bookListService.deleteList(listId).subscribe({
      next: () => {
        this.lists = this.lists.filter(l => l.id !== listId);
        if (this.selectedList?.id === listId) this.closeDetail();
        this.showMessage('🗑️ Deleted');
      }
    });
  }

  getBookImage(book: any): string | null {
    if (!book || !book.pic) return null;
    let pic = book.pic.trim();
    if (pic.startsWith('http://') || pic.startsWith('https://')) return pic;
    if (pic.startsWith('/uploads/')) return `http://localhost:8081${pic}`;
    if (pic.startsWith('uploads/')) return `http://localhost:8081/${pic}`;
    return `http://localhost:8081/uploads/${pic}`;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    const parent = event.target.parentElement;
    if (parent && !parent.querySelector('.book-placeholder')) {
      const placeholder = document.createElement('div');
      placeholder.className = 'book-placeholder';
      placeholder.innerHTML = '<span>📕</span>';
      parent.appendChild(placeholder);
    }
  }

  private showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }
}