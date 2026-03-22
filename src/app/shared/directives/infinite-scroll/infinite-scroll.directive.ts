import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective {
  readonly infiniteScrollThreshold = input(600);
  readonly infiniteScrollDisabled = input(false);
  readonly infiniteScrollReached = output<void>();

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.infiniteScrollDisabled()) {
      return;
    }

    const threshold = this.infiniteScrollThreshold();
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;

    if (nearBottom) {
      this.infiniteScrollReached.emit();
    }
  }
}
