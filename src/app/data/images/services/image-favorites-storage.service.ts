import { computed, effect, Injectable, signal } from '@angular/core';
import { STORAGE_KEY } from '@xm/shared/const';

import { ImageMetadata } from '../models/images.model';

@Injectable({
  providedIn: 'root'
})
export class ImageFavoritesStorageService {
  readonly #storageKey = STORAGE_KEY;
  readonly #map = signal<Record<string, ImageMetadata>>(this.load());

  readonly list = computed(() => Object.values(this.#map()));

  constructor() {
    effect(() => {
      this.save(this.#map());
    });
  }

  isFav(id: string): boolean {
    return !!this.#map()[id];
  }

  add(img: ImageMetadata): void {
    this.#map.update((map) => ({ ...map, [img.id]: img }));
  }

  remove(id: string): void {
    this.#map.update((map) => {
      const copy = { ...map };
      delete copy[id];
      return copy;
    });
  }

  get(id: string): ImageMetadata | undefined {
    return this.#map()[id];
  }

  private load(): Record<string, ImageMetadata> {
    try {
      const raw = localStorage.getItem(this.#storageKey);
      return raw ? (JSON.parse(raw) as Record<string, ImageMetadata>) : {};
    } catch {
      return {};
    }
  }

  private save(favorites: Record<string, ImageMetadata>): void {
    try {
      localStorage.setItem(this.#storageKey, JSON.stringify(favorites));
    } catch {
      console.error('Failed to save favorites to localStorage');
    }
  }
}
