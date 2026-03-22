import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adaLovelaceImageMock, ImageStateService, ImagesService, type ImageMetadata } from '@xm/data/images';

import { AllImagesList } from './all-images-list';

describe('AllImagesList', () => {
  let component: AllImagesList;
  let fixture: ComponentFixture<AllImagesList>;
  const images = signal<ImageMetadata[]>([]);
  const loading = signal(false);
  const imageStateMock = {
    images,
    loading,
    loadMore: jest.fn()
  };
  const imagesServiceMock = {
    isFav: jest.fn().mockReturnValue(false),
    add: jest.fn(),
    remove: jest.fn()
  };

  const image: ImageMetadata = adaLovelaceImageMock;

  beforeEach(async () => {
    images.set([image]);
    loading.set(false);
    imageStateMock.loadMore.mockReset();
    imagesServiceMock.isFav.mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [AllImagesList],
      providers: [
        { provide: ImageStateService, useValue: imageStateMock },
        { provide: ImagesService, useValue: imagesServiceMock },
        { provide: Router, useValue: { navigate: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllImagesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not request another page on init when images are already cached', () => {
    expect(imageStateMock.loadMore).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelectorAll('app-image-item')).toHaveLength(1);
  });

  it('should request the first page on init when no images are cached', async () => {
    images.set([]);
    imageStateMock.loadMore.mockReset();

    fixture = TestBed.createComponent(AllImagesList);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(imageStateMock.loadMore).toHaveBeenCalledTimes(1);
  });

  it('should show the spinner while loading', () => {
    loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-spinner')).not.toBeNull();
  });

  it('should not render the spinner when loading is false', () => {
    loading.set(false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-spinner')).toBeNull();
  });

  it('should request another page when loadMore is called manually', () => {
    component.loadMore();

    expect(imageStateMock.loadMore).toHaveBeenCalledTimes(1);
  });
});
