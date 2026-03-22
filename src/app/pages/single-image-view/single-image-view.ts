import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImageMetadata, ImagesService, ImageStateService } from '@xm/data/images';
import { Spinner } from '@xm/shared/components';

@Component({
  selector: 'app-single-image-view',
  standalone: true,
  imports: [CommonModule, RouterModule, Spinner, MatButtonModule, MatIconModule],
  templateUrl: './single-image-view.html',
  styleUrls: ['./single-image-view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleImageView implements OnInit {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #imageId = computed(() => this.#route.snapshot.paramMap.get('id') ?? '');
  readonly #imageState = inject(ImageStateService);
  readonly image = this.#imageState.imageForId(this.#imageId());
  readonly imageLoading = this.#imageState.imageLoading(this.#imageId());
  readonly #imageService = inject(ImagesService);
  readonly isFavorite = computed(() => this.#imageService.isFav(this.#imageId()));

  readonly favLabel = computed(() => {
    return this.isFavorite() ? 'Remove from favorites' : 'Add to favorites';
  });

  ngOnInit() {
    const id = this.#route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    const found = this.image();
    if (!found) {
      this.#imageState.fetchImage(id);
    }
  }

  toggleFav(): void {
    const img: ImageMetadata | undefined = this.image() ? this.image() : undefined;
    if (!img) {
      return;
    }

    if (this.#imageService.isFav(img.id)) {
      this.#imageService.remove(img.id);
      this.#router.navigate(['/detail', img.id]);
    } else {
      this.#imageService.add(img);
      this.#router.navigate(['/favorites', img.id]);
    }
  }

  goBack(): void {
    const imageId = this.#imageId();
    if (imageId && this.#imageService.isFav(imageId)) {
      this.#router.navigate(['/favorites']);
      return;
    }

    this.#router.navigate(['/']);
  }
}
