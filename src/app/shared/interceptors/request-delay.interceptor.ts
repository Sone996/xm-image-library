import { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs';

import { URL } from '../const';

const MIN_DELAY_MS = 200;
const MAX_DELAY_MS = 300;

// to simulate network latency and loading states in the UI, we add a random delay to all requests to the server
function getRandomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

export const requestDelayInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(URL)) {
    return next(request);
  }

  return next(request).pipe(delay(getRandomDelay()));
};
