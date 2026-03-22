import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    removeEventListener: jest.fn(),
    removeListener: jest.fn()
  }))
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});
