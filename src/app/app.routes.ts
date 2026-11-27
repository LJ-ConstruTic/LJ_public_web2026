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
    path: 'service-detail/:id',
    loadComponent: () => import('./components/body/services-detail/services-detail.component').then(m => m.ServicesDetailComponent),
  },
  {
    path: 'news/news-detail',
    loadComponent: () => import('./components/body/news-detail/news-detail.component').then(m => m.NewsDetailComponent),
  },
  {
    path: 'product-detail/:id',
    loadComponent: () => import('./components/body/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./components/footer/privacity/privacity.component').then(m => m.PrivacityComponent),
  },
  {
    path: 'term-condition',
    loadComponent: () => import('./components/footer/conditions/conditions.component').then(m => m.ConditionsComponent),
  },
  {
    path: 'date-protect',
    loadComponent: () => import('./components/footer/data-protection/data-protection.component').then(m => m.DataProtectionComponent),
  },
  {
    path: 'privated',
    loadComponent: () => import('./components/footer/privacity/privacity.component').then(m => m.PrivacityComponent),
  },
  {
    path: 'cookies',
    loadComponent: () => import('./components/footer/cookies/cookies.component').then(m => m.CookiesComponent),
  },

  { path: 'about', redirectTo: 'about/about-detail', pathMatch: 'full' },
  { path: 'not-found', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
