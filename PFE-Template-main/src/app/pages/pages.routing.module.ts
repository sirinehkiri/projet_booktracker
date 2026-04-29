import { Routes } from '@angular/router';
import { ReviewComponent } from './blogs/review/review.component';

export const PagesRoutes: Routes = [
    {
        path:'review/:id',
        component: ReviewComponent
    }
];
