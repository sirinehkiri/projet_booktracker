import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';

import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    TablerIconsModule,
    RouterModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  isLoading = true;

  recommendations: any[] = [];
  loadingRecommendations = false;

  currentUserId!: number;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.currentUserId = +id;

        this.loadProfile(this.currentUserId);
        this.loadRecommendations(
            this.currentUserId
        );
      }
    });
  }

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(userId: number): void {
    this.isLoading = true;

    this.profileService
        .getProfile(userId)
        .subscribe({
          next: (data) => {
            this.profile = data;
            this.isLoading = false;

            console.log('PROFILE:', this.profile);
          },
          error: (err) => {
            console.error(
                'Erreur chargement profil',
                err
            );
            this.isLoading = false;
          }
        });
  }

  // =====================================================
  // LOAD RECOMMENDATIONS
  // =====================================================

  loadRecommendations(userId: number): void {
    this.loadingRecommendations = true;

    this.profileService
        .getRecommendations(userId)
        .subscribe({
          next: (data: any[]) => {
            this.recommendations = data || [];
            this.loadingRecommendations = false;

            console.log(
                'RECOMMENDATIONS:',
                this.recommendations
            );
          },
          error: (err) => {
            console.error(
                'Error recommendations',
                err
            );
            this.loadingRecommendations = false;
          }
        });
  }

  // =====================================================
  // IMAGE USER
  // =====================================================

  getContactImage(): string | null {
    if (this.profile?.image) {
      return `http://localhost:8081/uploads/${this.profile.image}`;
    }

    return null;
  }

  // =====================================================
  // INITIAL USER
  // =====================================================

  getContactInitial(): string {
    return this.profile?.username
      ? this.profile.username
          .charAt(0)
          .toUpperCase()
      : 'U';
  }
}