import { TestBed } from '@angular/core/testing';
import { STORAGE_KEY } from '@xm/shared/const';
import { dorothyVaughanImageMock, type ImageMetadata } from '..';

import { ImageFavoritesStorageService } from './image-favorites-storage.service';

describe('ImageFavoritesStorageService', () => {
  const image: ImageMetadata = dorothyVaughanImageMock;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should load persisted favorites from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ [image.id]: image }));

    const service = TestBed.inject(ImageFavoritesStorageService);

    expect(service.list()).toEqual([image]);
    expect(service.isFav(image.id)).toBe(true);
    expect(service.get(image.id)).toEqual(image);
  });

  it('should add and remove favorites while keeping storage in sync', () => {
    const service = TestBed.inject(ImageFavoritesStorageService);

    service.add(image);
    TestBed.tick();
    expect(service.list()).toEqual([image]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({ [image.id]: image });

    service.remove(image.id);
    TestBed.tick();
    expect(service.list()).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toEqual({});
  });
});
