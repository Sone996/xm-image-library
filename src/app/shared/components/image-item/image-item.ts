import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ImageMetadata, ImagesService } from '@xm/data/images';

@Component({
  selector: 'app-image-item',
  standalone: true,
  imports: [NgOptimizedImage, MatButtonModule, MatIconModule],
  templateUrl: './image-item.html',
  styleUrls: ['./image-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageItem {
  readonly image = input.required<ImageMetadata>();
  readonly showLikeAnimation = signal(false);

  readonly #router = inject(Router);
  readonly imageService = inject(ImagesService);

  addToFavorites(): void {
    const img = this.image();
    if (!img || this.imageService.isFav(img.id)) {
      return;
    }

    this.imageService.add(img);
    this.playLikeAnimation();
  }

  openDetail(event: Event): void {
    event.stopPropagation();

    const img = this.image();
    if (!img) {
      return;
    }

    if (this.imageService.isFav(img.id)) {
      this.#router.navigate(['/favorites', img.id]);
    } else {
      this.#router.navigate(['/detail', img.id]);
    }
  }

  toggleFav(event: Event): void {
    event.stopPropagation();

    const img = this.image();
    if (!img) {
      return;
    }

    if (this.imageService.isFav(img.id)) {
      this.imageService.remove(img.id);
    } else {
      this.imageService.add(img);
      this.playLikeAnimation();
    }
  }

  onLikeAnimationEnd(): void {
    this.showLikeAnimation.set(false);
  }

  private playLikeAnimation(): void {
    this.showLikeAnimation.set(true);
  }
}
