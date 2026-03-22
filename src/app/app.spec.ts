import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideNoopAnimations()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the header shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).not.toBeNull();
  });

  it('should toggle header visibility based on scroll direction', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 120
    });
    app.onWindowScroll();
    expect(app.headerVisible()).toBe(false);

    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 48
    });
    app.onWindowScroll();
    expect(app.headerVisible()).toBe(true);
  });
});
