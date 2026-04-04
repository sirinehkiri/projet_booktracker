import { Component, OnInit } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class AppNotesComponent implements OnInit {
  

  sidePanelOpened = true;
  notes = this.noteService.getNotes();
  selectedNote: Note | null = null;
  active: boolean = false;
  searchText = '';
  clrName = 'warning';
  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'accent' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];
  constructor(public noteService: NoteService) {
    this.notes = this.noteService.getNotes();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.notes = this.filter(filterValue);
  }

  filter(v: string): Note[] {
    return this.noteService
      .getNotes()
      .filter((x) => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }


  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.onLoad();
  }
  onLoad(): void {
    this.selectedNote = this.notes.length > 0 ? this.notes[0] : null;
  }

  removenote(note: Note): void {
    const index: number = this.notes.indexOf(note);
    if (index !== -1) {
      this.notes.splice(index, 1);
      this.selectedNote = this.notes.length > 0 ? this.notes[0] : null;
    }
  }
  addNoteClick(): void {
    this.notes.unshift({
      title: 'this is New notes',
      datef: new Date(),
      likes: 0,
    comments: []
    });
  }
  likeNote(note: Note) {
  note.likes++;
}
addComment(note: Note, text: string) {
  if (!text.trim()) return;

  note.comments.push({
    text: text,
    date: new Date()
  });
}
}
