import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/body/body-page.component').then(m => m.BodyPageComponent),
  },
  {
    path: 'about/about-detail',
    loadComponent: () => import('./components/body/about-detail/about-detail.component').then(m => m.AboutDetailComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./components/footer/privacity/privacity.component').then(m => m.PrivacityComponent),
  },
  {
    path: 'data-protection',
    loadComponent: () => import('./components/footer/data-protection/data-protection.component').then(m => m.DataProtectionComponent),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./components/footer/cookies/cookies.component').then(m => m.CookiesComponent),
  },
  {
    path: 'conditions',
    loadComponent: () => import('./components/footer/conditions/conditions.component').then(m => m.ConditionsComponent),
  },
  { path: 'about', redirectTo: 'body-page', pathMatch: 'full' },
  { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: 'not-found' },
];
