import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/all-images-list').then((m) => m.AllImagesList),
    title: 'All Images',
    data: { animationOrder: 0 }
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorite-images-list').then((m) => m.FavoriteImagesList),
    title: 'Favorites',
    data: { animationOrder: 1 }
  },
  {
    path: 'favorites/:id',
    loadComponent: () => import('./pages/single-image-view').then((m) => m.SingleImageView),
    title: 'Image Detail',
    data: { animationOrder: 2 }
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./pages/single-image-view').then((m) => m.SingleImageView),
    title: 'Image Detail',
    data: { animationOrder: 2 }
  },
  { path: '**', redirectTo: '' }
];
