import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { adaLovelaceImageMock, ImageFavoritesStorageService, type ImageMetadata } from '@xm/data/images';

import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;
  const list = signal<ImageMetadata[]>([]);
  const favoritesStorageMock = {
    list,
    isFav: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
    get: jest.fn()
  };

  const image: ImageMetadata = adaLovelaceImageMock;

  beforeEach(() => {
    list.set([]);
    favoritesStorageMock.isFav.mockReset();
    favoritesStorageMock.add.mockReset();
    favoritesStorageMock.remove.mockReset();
    favoritesStorageMock.get.mockReset();

    TestBed.configureTestingModule({
      providers: [{ provide: ImageFavoritesStorageService, useValue: favoritesStorageMock }]
    });
    service = TestBed.inject(ImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the favorites list signal from storage', () => {
    list.set([image]);

    expect(service.list()).toEqual([image]);
  });

  it('should delegate favorites mutations and lookups to storage', () => {
    favoritesStorageMock.isFav.mockReturnValue(true);
    favoritesStorageMock.get.mockReturnValue(image);

    service.add(image);
    service.remove(image.id);

    expect(service.isFav(image.id)).toBe(true);
    expect(service.get(image.id)).toEqual(image);
    expect(favoritesStorageMock.add).toHaveBeenCalledWith(image);
    expect(favoritesStorageMock.remove).toHaveBeenCalledWith(image.id);
  });
});
