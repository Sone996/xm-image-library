import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { imageItemImageMock, ImagesService } from '@xm/data/images';

import { ImageItem } from './image-item';

describe('ImageItem', () => {
  let component: ImageItem;
  let fixture: ComponentFixture<ImageItem>;
  const routerMock = {
    navigate: jest.fn()
  };
  const imagesServiceMock = {
    isFav: jest.fn(),
    add: jest.fn(),
    remove: jest.fn()
  };

  const image = imageItemImageMock;

  beforeEach(async () => {
    routerMock.navigate.mockReset();
    routerMock.navigate.mockResolvedValue(true);
    imagesServiceMock.isFav.mockReset();
    imagesServiceMock.isFav.mockReturnValue(false);
    imagesServiceMock.add.mockReset();
    imagesServiceMock.remove.mockReset();

    await TestBed.configureTestingModule({
      imports: [ImageItem],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ImagesService, useValue: imagesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageItem);
    fixture.componentRef.setInput('image', image);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a non-favorite image and trigger the like animation on card click', () => {
    component.addToFavorites();

    expect(imagesServiceMock.add).toHaveBeenCalledWith(image);
    expect(component.showLikeAnimation()).toBe(true);
  });

  it('should navigate to the favorite detail page when opening a favorited image', () => {
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    imagesServiceMock.isFav.mockReturnValue(true);

    component.openDetail(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/favorites', image.id]);
  });

  it('should remove a favorite image when toggled off', () => {
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    imagesServiceMock.isFav.mockReturnValue(true);

    component.toggleFav(event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(imagesServiceMock.remove).toHaveBeenCalledWith(image.id);
  });

  it('should not add an image again when it is already a favorite', () => {
    imagesServiceMock.isFav.mockReturnValue(true);

    component.addToFavorites();

    expect(imagesServiceMock.add).not.toHaveBeenCalled();
    expect(component.showLikeAnimation()).toBe(false);
  });

  it('should navigate to the generic detail page when opening a non-favorite image', () => {
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    imagesServiceMock.isFav.mockReturnValue(false);

    component.openDetail(event);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/detail', image.id]);
  });

  it('should add a non-favorite image when toggled on and reset the animation when it ends', () => {
    const event = { stopPropagation: jest.fn() } as unknown as Event;
    imagesServiceMock.isFav.mockReturnValue(false);

    component.toggleFav(event);
    expect(imagesServiceMock.add).toHaveBeenCalledWith(image);
    expect(component.showLikeAnimation()).toBe(true);

    component.onLikeAnimationEnd();
    expect(component.showLikeAnimation()).toBe(false);
  });
});
