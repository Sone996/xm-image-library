import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { routeSlideAnimation } from './route-slide.animation';
import { AppHeader } from './shared/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader],
  animations: [routeSlideAnimation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly headerVisible = signal(true);

  #lastScrollY = 0;

  getRouteAnimationOrder(outlet: RouterOutlet): number {
    return outlet.activatedRouteData['animationOrder'] ?? 0;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      this.headerVisible.set(true);
      this.#lastScrollY = 0;
      return;
    }

    if (currentScrollY < this.#lastScrollY) {
      this.headerVisible.set(true);
    } else if (currentScrollY > this.#lastScrollY) {
      this.headerVisible.set(false);
    }

    this.#lastScrollY = currentScrollY;
  }
}
