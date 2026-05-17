import { Component, OnInit } from '@angular/core';
import { PreferencesService } from '../../../services/preferences.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  loading: boolean = true;
  saving: boolean = false;
  message: string = '';

  availableGenres: string[] = [
    'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller',
    'Horror', 'Historical Fiction', 'Biography', 'Self-Help',
    'Business', 'Philosophy', 'Poetry', 'Drama', 'Adventure',
    'Young Adult', 'Children', 'Comics', 'Non-Fiction', 'Travel', 'Cooking'
  ];

  availableLanguages: string[] = [
    'English', 'French', 'Spanish', 'German', 'Italian',
    'Arabic', 'Chinese', 'Japanese', 'Russian', 'Portuguese'
  ];

  selectedGenres: string[] = [];
  selectedLanguages: string[] = [];
  favoriteAuthors: string = '';
  monthlyGoal: number = 0;
  socialRecommendations: boolean = false;

  constructor(private prefsService: PreferencesService) {}

  ngOnInit(): void {
    this.loadPreferences();
  }

  loadPreferences(): void {
    this.loading = true;
    this.prefsService.getPreferences().subscribe({
      next: (data) => {
        this.selectedGenres = data.preferredGenres || [];
        this.selectedLanguages = data.preferredLanguages || [];
        this.favoriteAuthors = (data.favoriteAuthors || []).join(', ');
        this.monthlyGoal = data.monthlyReadingGoal || 0;
        this.socialRecommendations = data.socialRecommendations || false;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.loading = false;
      }
    });
  }

  toggleGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);
    if (index > -1) this.selectedGenres.splice(index, 1);
    else this.selectedGenres.push(genre);
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  toggleLanguage(language: string): void {
    const index = this.selectedLanguages.indexOf(language);
    if (index > -1) this.selectedLanguages.splice(index, 1);
    else this.selectedLanguages.push(language);
  }

  isLanguageSelected(language: string): boolean {
    return this.selectedLanguages.includes(language);
  }

  toggleSocialRecommendations(): void {
    this.socialRecommendations = !this.socialRecommendations;
  }

  savePreferences(): void {
    this.saving = true;

    const authors = this.favoriteAuthors
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    const data = {
      preferredGenres: this.selectedGenres,
      preferredLanguages: this.selectedLanguages,
      favoriteAuthors: authors,
      monthlyReadingGoal: Number(this.monthlyGoal),
      socialRecommendations: this.socialRecommendations
    };

    console.log('💾 Saving preferences:', data);

    this.prefsService.savePreferences(data).subscribe({
      next: () => {
        this.showMessage('✅ Preferences saved successfully!');
        this.saving = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.showMessage('❌ Failed to save preferences');
        this.saving = false;
      }
    });
  }

  private showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }

  getGenreIcon(genre: string): string {
    const icons: any = {
      'Fantasy': '🐉', 'Science Fiction': '🚀', 'Romance': '💕',
      'Mystery': '🔍', 'Thriller': '😱', 'Horror': '👻',
      'Historical Fiction': '🏰', 'Biography': '👤', 'Self-Help': '🌱',
      'Business': '💼', 'Philosophy': '🤔', 'Poetry': '📝',
      'Drama': '🎭', 'Adventure': '🗺️', 'Young Adult': '🎓',
      'Children': '🧸', 'Comics': '💥', 'Non-Fiction': '📰',
      'Travel': '✈️', 'Cooking': '🍳'
    };
    return icons[genre] || '📚';
  }
}