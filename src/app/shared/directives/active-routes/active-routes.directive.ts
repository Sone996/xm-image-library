import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IsActiveMatchOptions, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

const DEFAULT_MATCH_OPTIONS: IsActiveMatchOptions = {
  paths: 'exact',
  queryParams: 'ignored',
  fragment: 'ignored',
  matrixParams: 'ignored'
};

@Directive({
  selector: '[appActiveRoutes]',
  standalone: true
})
export class ActiveRoutesDirective {
  readonly activeRoutes = input.required<readonly string[]>();
  readonly activeRoutesClass = input('active');
  readonly activeRoutesMatchOptions = input<IsActiveMatchOptions>(DEFAULT_MATCH_OPTIONS);

  readonly #elementRef = inject(ElementRef<HTMLElement>);
  readonly #renderer = inject(Renderer2);
  readonly #router = inject(Router);

  readonly #navigationUrl = toSignal(
    this.#router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.#router.url),
      startWith(this.#router.url)
    ),
    { initialValue: this.#router.url }
  );

  constructor() {
    effect(() => {
      this.#navigationUrl();

      const isActive = this.activeRoutes().some((route) => this.isRouteActive(route));
      const className = this.activeRoutesClass();

      if (isActive) {
        this.#renderer.addClass(this.#elementRef.nativeElement, className);
      } else {
        this.#renderer.removeClass(this.#elementRef.nativeElement, className);
      }
    });
  }

  private isRouteActive(route: string): boolean {
    const matchOptions = this.activeRoutesMatchOptions();

    if (route === '/') {
      return this.#router.isActive(route, matchOptions);
    }

    return (
      this.#router.isActive(route, matchOptions) ||
      this.#router.isActive(route, {
        ...matchOptions,
        paths: 'subset'
      })
    );
  }
}
