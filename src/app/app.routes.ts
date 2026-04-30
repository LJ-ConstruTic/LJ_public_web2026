import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/body/body-page.component').then(m => m.BodyPageComponent),
  },
  {
    path: 'about-detail',
    loadComponent: () => import('./components/body/about-detail/about-detail.component').then(m => m.AboutDetailComponent),
  },
  { path: 'about', redirectTo: 'body-page', pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
