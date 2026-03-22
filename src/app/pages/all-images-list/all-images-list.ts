import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ImageStateService } from '@xm/data/images';
import { GridWrapper, ImageItem, Spinner } from '@xm/shared/components';
import { InfiniteScrollDirective } from '@xm/shared/directives';

@Component({
  selector: 'app-all-images-list',
  standalone: true,
  imports: [CommonModule, GridWrapper, ImageItem, Spinner, InfiniteScrollDirective],
  templateUrl: './all-images-list.html',
  styleUrls: ['./all-images-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllImagesList implements OnInit {
  readonly #imageState = inject(ImageStateService);
  readonly images = computed(() => this.#imageState.images());
  readonly loading = computed(() => this.#imageState.loading());

  ngOnInit() {
    if (this.images().length > 0) {
      return;
    }

    this.#imageState.loadMore();
  }

  loadMore(): void {
    this.#imageState.loadMore();
  }
}
