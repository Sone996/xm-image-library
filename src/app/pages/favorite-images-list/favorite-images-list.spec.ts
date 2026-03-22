import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { graceHopperImageMock, ImagesService, radiaPerlmanImageMock, type ImageMetadata } from '@xm/data/images';

import { FavoriteImagesList } from './favorite-images-list';

describe('FavoriteImagesList', () => {
  let component: FavoriteImagesList;
  let fixture: ComponentFixture<FavoriteImagesList>;
  const favorites = signal<ImageMetadata[]>([]);
  const imagesServiceMock = {
    list: favorites,
    isFav: jest.fn().mockReturnValue(false),
    add: jest.fn(),
    remove: jest.fn()
  };

  const image: ImageMetadata = graceHopperImageMock;
  const secondImage: ImageMetadata = radiaPerlmanImageMock;

  beforeEach(async () => {
    favorites.set([]);
    imagesServiceMock.isFav.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [FavoriteImagesList],
      providers: [
        { provide: ImagesService, useValue: imagesServiceMock },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteImagesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an empty state when there are no favorites', () => {
    expect(fixture.nativeElement.textContent).toContain('No favorites yet.');
  });

  it('should render favorite image items when favorites exist', () => {
    favorites.set([image]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-image-item')).toHaveLength(1);
  });

  it('should hide the empty state when favorites exist', () => {
    favorites.set([image]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.favorite-images-list__empty')).toBeNull();
  });

  it('should render all favorite image items when the favorites signal grows', () => {
    favorites.set([image, secondImage]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-image-item')).toHaveLength(2);
  });
});
