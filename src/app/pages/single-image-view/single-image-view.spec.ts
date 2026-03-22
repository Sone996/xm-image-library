import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ImagesService, ImageStateService, katherineJohnsonImageMock, type ImageMetadata } from '@xm/data/images';

import { SingleImageView } from './single-image-view';

describe('SingleImageView', () => {
  let component: SingleImageView;
  let fixture: ComponentFixture<SingleImageView>;
  const imageSignal = signal<ImageMetadata | undefined>(undefined);
  const loadingSignal = signal(false);
  const routerMock = {
    navigate: jest.fn()
  };
  const imagesServiceMock = {
    isFav: jest.fn(),
    add: jest.fn(),
    remove: jest.fn()
  };
  const imageStateMock = {
    imageForId: jest.fn((id: string) => computed(() => (id ? imageSignal() : undefined))),
    imageLoading: jest.fn(() => computed(() => loadingSignal())),
    fetchImage: jest.fn()
  };

  const image: ImageMetadata = katherineJohnsonImageMock;

  beforeEach(async () => {
    imageSignal.set(undefined);
    loadingSignal.set(false);
    routerMock.navigate.mockReset();
    routerMock.navigate.mockResolvedValue(true);
    imagesServiceMock.isFav.mockReset();
    imagesServiceMock.add.mockReset();
    imagesServiceMock.remove.mockReset();
    imageStateMock.imageForId.mockClear();
    imageStateMock.imageLoading.mockClear();
    imageStateMock.fetchImage.mockReset();

    await TestBed.configureTestingModule({
      imports: [SingleImageView],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
        { provide: Router, useValue: routerMock },
        { provide: ImagesService, useValue: imagesServiceMock },
        { provide: ImageStateService, useValue: imageStateMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleImageView);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch the image on init when it is missing from state', () => {
    fixture.detectChanges();

    expect(imageStateMock.fetchImage).toHaveBeenCalledWith('1');
  });

  it('should add an image to favorites and navigate to the favorites detail route', () => {
    imageSignal.set(image);
    imagesServiceMock.isFav.mockReturnValue(false);
    fixture.detectChanges();

    component.toggleFav();

    expect(imagesServiceMock.add).toHaveBeenCalledWith(image);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/favorites', image.id]);
  });

  it('should remove an image from favorites and navigate to the generic detail route', () => {
    imageSignal.set(image);
    imagesServiceMock.isFav.mockReturnValue(true);
    fixture.detectChanges();

    component.toggleFav();

    expect(imagesServiceMock.remove).toHaveBeenCalledWith(image.id);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/detail', image.id]);
  });

  it('should navigate back to favorites when the current image is a favorite', () => {
    imagesServiceMock.isFav.mockReturnValue(true);
    fixture.detectChanges();

    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/favorites']);
  });

  it('should not fetch the image on init when it is already available', () => {
    imageSignal.set(image);
    fixture.detectChanges();

    expect(imageStateMock.fetchImage).not.toHaveBeenCalled();
  });

  it('should navigate back to the home route when the current image is not a favorite', () => {
    imagesServiceMock.isFav.mockReturnValue(false);
    fixture.detectChanges();

    component.goBack();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
