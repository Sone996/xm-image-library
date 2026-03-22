import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImagesService } from '@xm/data/images';
import { GridWrapper, ImageItem } from '@xm/shared/components';

@Component({
  selector: 'app-favorite-images-list',
  standalone: true,
  imports: [CommonModule, RouterModule, GridWrapper, ImageItem],
  templateUrl: './favorite-images-list.html',
  styleUrls: ['./favorite-images-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteImagesList {
  readonly #imageService = inject(ImagesService);
  readonly favorites = computed(() => this.#imageService.list());
}
