import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },

//   {
//     path: 'about/detail/:id',
//     loadComponent: () =>
//       import('./pages/about-detail/about-detail.component').then(m => m.AboutDetailComponent),
//   },
//   {
//     path: 'news/detail/:id',
//     loadComponent: () =>
//       import('./pages/news-detail/news-detail.component').then(m => m.NewsDetailComponent),
//   },
//   {
//     path: 'products/detail/:id',
//     loadComponent: () =>
//       import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
//   },
//   {
//     path: 'services/detail/:id',
//     loadComponent: () =>
//       import('./pages/services-detail/services-detail.component').then(m => m.ServicesDetailComponent),
//   },

  { path: '**', redirectTo: '' },
];
