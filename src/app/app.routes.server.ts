import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // The site loads localized content through the browser's same-origin API.
    renderMode: RenderMode.Client
  }
];
