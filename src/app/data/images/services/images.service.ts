import { httpResource } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { API_PATH, URL } from '@xm/shared/const';
import { ImageMetadata, ImageResponse } from '..';

import { ImageFavoritesStorageService } from './image-favorites-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  readonly #injector = inject(Injector);
  readonly #favoritesStorage = inject(ImageFavoritesStorageService);

  readonly list = this.#favoritesStorage.list;

  isFav(id: string) {
    return this.#favoritesStorage.isFav(id);
  }

  add(img: ImageMetadata) {
    this.#favoritesStorage.add(img);
  }

  remove(id: string) {
    this.#favoritesStorage.remove(id);
  }

  get(id: string): ImageMetadata | undefined {
    return this.#favoritesStorage.get(id);
  }

  getMetadataResource(pageIndex = 1, pageSize = 20) {
    return httpResource<ImageMetadata[]>(
      () => ({
        url: URL + API_PATH,
        params: {
          page: String(pageIndex),
          limit: String(pageSize)
        }
      }),
      {
        injector: this.#injector,
        parse: (response: unknown) => (response as ImageResponse[]).map((item) => this.mapResponse(item))
      }
    );
  }

  getImageDataResource(id: string) {
    return httpResource<ImageMetadata | undefined>(
      () =>
        id
          ? {
              url: this.getInfoUrlForId(id)
            }
          : undefined,
      {
        injector: this.#injector,
        parse: (response: unknown) => this.mapResponse(response as ImageResponse)
      }
    );
  }

  private getListUrlForId(id: string): string {
    return URL + `/id/${id}/600/400.webp`;
  }

  private getInfoUrlForId(id: string): string {
    return URL + `/id/${id}/info`;
  }

  private mapResponse(responseItem: ImageResponse): ImageMetadata {
    return {
      id: responseItem.id,
      author: responseItem.author,
      fullUrl: responseItem.download_url,
      listUrl: this.getListUrlForId(responseItem.id)
    } as ImageMetadata;
  }
}
