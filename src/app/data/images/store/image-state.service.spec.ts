import { TestBed } from '@angular/core/testing';
import { hedyLamarrImageMock, ImagesService, maryJacksonImageMock, type ImageMetadata } from '@xm/data/images';

import { ImageStateService } from './image-state.service';

type FakeResource<T> = {
  destroy: jest.Mock;
  error: () => unknown;
  hasValue: () => boolean;
  isLoading: () => boolean;
  reload: jest.Mock;
  setLoading: (value: boolean) => void;
  setValue: (value: T) => void;
  value: () => T;
};

function createFakeResource<T>(initialValue?: T): FakeResource<T> {
  let loading = false;
  let hasValue = initialValue !== undefined;
  let value = initialValue as T;

  return {
    destroy: jest.fn(),
    error: () => null,
    hasValue: () => hasValue,
    isLoading: () => loading,
    reload: jest.fn(),
    setLoading: (nextLoading: boolean) => {
      loading = nextLoading;
    },
    setValue: (nextValue: T) => {
      value = nextValue;
      hasValue = true;
      loading = false;
    },
    value: () => value
  };
}

describe('ImageStateService', () => {
  let service: ImageStateService;

  const listImage: ImageMetadata = hedyLamarrImageMock;
  const detailImage: ImageMetadata = maryJacksonImageMock;

  const metadataResource = createFakeResource<ImageMetadata[]>([listImage]);
  const detailResource = createFakeResource<ImageMetadata | undefined>(detailImage);
  const imagesServiceMock = {
    getImageDataResource: jest.fn(),
    getMetadataResource: jest.fn()
  };

  beforeEach(() => {
    metadataResource.setValue([listImage]);
    detailResource.setValue(detailImage);
    imagesServiceMock.getMetadataResource.mockReset();
    imagesServiceMock.getMetadataResource.mockReturnValue(metadataResource);
    imagesServiceMock.getImageDataResource.mockReset();
    imagesServiceMock.getImageDataResource.mockReturnValue(detailResource);

    TestBed.configureTestingModule({
      providers: [{ provide: ImagesService, useValue: imagesServiceMock }]
    });
    service = TestBed.inject(ImageStateService);
  });

  it('should load a metadata page and append it to the image list', () => {
    service.loadMore(10);
    TestBed.tick();

    expect(imagesServiceMock.getMetadataResource).toHaveBeenCalledWith(1, 10);
    expect(service.images()).toEqual([listImage]);
    expect(service.page()).toBe(2);
  });

  it('should fetch and cache an image detail resource', () => {
    service.fetchImage(detailImage.id);
    TestBed.tick();

    expect(imagesServiceMock.getImageDataResource).toHaveBeenCalledWith(detailImage.id);
    expect(service.getImage(detailImage.id)).toEqual(detailImage);
  });

  it('should destroy tracked resources and reset state when cleared', () => {
    service.loadMore();
    service.fetchImage(detailImage.id);
    TestBed.tick();

    service.clear();

    expect(metadataResource.destroy).toHaveBeenCalled();
    expect(detailResource.destroy).toHaveBeenCalled();
    expect(service.images()).toEqual([]);
    expect(service.details()).toEqual({});
    expect(service.page()).toBe(1);
  });
});
