export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  cover?: string;
}

export interface UserBook {
  id: number;
  status: string;
  totalPages: number;
  pagesRead: number;
  progress: number;
  finishDate?: string;
  book: Book;
}