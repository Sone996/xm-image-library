import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { ImageMetadata, ImagesService } from '..';

@Injectable({ providedIn: 'root' })
export class ImageStateService {
  readonly #imageService = inject(ImagesService);

  readonly #metadataResource = signal<ReturnType<ImagesService['getMetadataResource']> | null>(null);
  readonly #metadataRequestKey = signal<string | null>(null);
  readonly #processedMetadataRequestKey = signal<string | null>(null);
  readonly #imageResources = signal<Record<string, ReturnType<ImagesService['getImageDataResource']>>>({});

  readonly #images = signal<ImageMetadata[]>([]);
  readonly images = this.#images;

  readonly #page = signal(1);
  readonly page = this.#page;

  readonly loading = computed(() => this.#metadataResource()?.isLoading() ?? false);
  readonly error = computed(() => this.#metadataResource()?.error());

  readonly #details = signal<Record<string, ImageMetadata>>({});
  readonly details = this.#details;

  constructor() {
    effect(() => {
      const resource = this.#metadataResource();
      const requestKey = this.#metadataRequestKey();

      if (!resource || !requestKey || resource.isLoading() || !resource.hasValue()) {
        return;
      }

      if (this.#processedMetadataRequestKey() === requestKey) {
        return;
      }

      this.#processedMetadataRequestKey.set(requestKey);
      this.#images.update((images) => [...images, ...resource.value()]);
      this.#page.update((page) => page + 1);
    });

    effect(() => {
      const resources = this.#imageResources();
      const details = this.#details();

      for (const [id, resource] of Object.entries(resources)) {
        if (details[id] || resource.isLoading() || !resource.hasValue()) {
          continue;
        }

        const meta = resource.value();
        if (meta) {
          this.#details.update((current) => ({ ...current, [id]: meta }));
        }
      }
    });
  }

  loadMore(pageSize = 20) {
    if (this.loading()) {
      return;
    }

    const page = this.#page();
    const currentResource = this.#metadataResource();
    currentResource?.destroy();

    this.#metadataRequestKey.set(`${page}:${pageSize}`);
    this.#metadataResource.set(this.#imageService.getMetadataResource(page, pageSize));
  }

  getImage(id: string): ImageMetadata | undefined {
    const byList = this.images().find((i) => i.id === id);
    if (byList) {
      return byList;
    }
    return this.details()[id];
  }

  imageForId(id: string) {
    return computed(() => {
      const byList = this.images().find((i) => i.id === id);
      if (byList) {
        return byList;
      }
      return this.details()[id];
    });
  }

  imageLoading(id: string) {
    return computed(() => this.#imageResources()[id]?.isLoading() ?? false);
  }

  imageError(id: string) {
    return computed(() => this.#imageResources()[id]?.error());
  }

  fetchImage(id: string) {
    if (this.details()[id] || this.images().find((i) => i.id === id)) {
      return;
    }

    const existingResource = this.#imageResources()[id];
    if (existingResource) {
      if (!existingResource.isLoading() && !existingResource.hasValue()) {
        existingResource.reload();
      }
      return;
    }

    this.#imageResources.update((resources) => ({
      ...resources,
      [id]: this.#imageService.getImageDataResource(id)
    }));
  }

  clear() {
    this.#metadataResource()?.destroy();
    for (const resource of Object.values(this.#imageResources())) {
      resource.destroy();
    }

    this.#metadataResource.set(null);
    this.#metadataRequestKey.set(null);
    this.#processedMetadataRequestKey.set(null);
    this.#imageResources.set({});
    this.#images.set([]);
    this.#page.set(1);
    this.#details.set({});
  }
}
