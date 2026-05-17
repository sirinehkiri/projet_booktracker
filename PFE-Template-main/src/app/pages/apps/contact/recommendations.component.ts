import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PreferencesService } from '../../../services/preferences.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recommendations: any[] = [];
  loading: boolean = true;
  error: string = '';
  isSocial: boolean = false;

  constructor(
    private http: HttpClient,
    private prefsService: PreferencesService
  ) {}

  ngOnInit(): void {
    console.log('🚀 RecommendationsComponent INIT');
    this.checkPreferencesAndLoad();
  }

  checkPreferencesAndLoad(): void {
    console.log('📞 Loading preferences from backend...');
    
    this.prefsService.getPreferences().subscribe({
      next: (prefs) => {
        console.log('✅ Preferences received:', prefs);
        console.log('🔍 socialRecommendations value:', prefs.socialRecommendations);
        console.log('🔍 typeof:', typeof prefs.socialRecommendations);

        // 🔥 Conversion stricte en boolean
        this.isSocial = prefs.socialRecommendations === true;
        console.log('🎯 Final isSocial:', this.isSocial);

        this.loadRecommendations();
      },
      error: (err) => {
        console.error('❌ Error loading preferences:', err);
        this.isSocial = false;
        this.loadRecommendations();
      }
    });
  }

  loadRecommendations(): void {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('token');
    const username = this.getUsername();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache'  // 🔥 Pas de cache
    });

    // 🔥 Choisir endpoint selon préférence
    const endpoint = this.isSocial
      ? `http://localhost:8081/books/recommendations/user/${username}/social`
      : `http://localhost:8081/books/recommendations/user/${username}/personalized`;

    console.log('=================================');
    console.log('🎯 Mode:', this.isSocial ? 'SOCIAL 👥' : 'PERSONALIZED 🎯');
    console.log('📞 Calling endpoint:', endpoint);
    console.log('=================================');

    this.http.get<any[]>(endpoint, { headers }).subscribe({
      next: (data) => {
        console.log('✅ Backend returned:', data.length, 'books');
        console.log('📚 First book:', data[0]);
        this.recommendations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error = err.error?.message || 'Failed to load recommendations';
        this.loading = false;
      }
    });
  }

  // 🆕 Bouton pour rafraîchir manuellement
  refresh(): void {
    console.log('🔄 Manual refresh');
    this.checkPreferencesAndLoad();
  }

  getUsername(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || '';
    } catch (e) {
      return '';
    }
  }

  getBookImage(book: any): string | null {
    if (!book || !book.pic) return null;
    const pic = book.pic.trim();
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

  getStars(rating: number): string {
    const stars = Math.round(rating);
    return '⭐'.repeat(Math.min(stars, 5));
  }
}