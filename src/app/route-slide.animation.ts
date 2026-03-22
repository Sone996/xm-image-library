import { animate, group, query, style, transition, trigger } from '@angular/animations';

const ROUTE_TIMING = '260ms cubic-bezier(0.35, 0, 0.25, 1)';

function buildSlideMotion(enterFrom: string, leaveTo: string) {
  return [
    query(
      ':enter, :leave',
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      }),
      { optional: true }
    ),
    query(
      ':enter',
      style({
        transform: `translateX(${enterFrom})`,
        opacity: 0.88
      }),
      { optional: true }
    ),
    group([
      query(
        ':leave',
        [
          animate(
            ROUTE_TIMING,
            style({
              transform: `translateX(${leaveTo})`,
              opacity: 0.7
            })
          )
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          animate(
            ROUTE_TIMING,
            style({
              transform: 'translateX(0)',
              opacity: 1
            })
          )
        ],
        { optional: true }
      )
    ])
  ];
}

export const routeSlideAnimation = trigger('routeSlideAnimation', [
  transition(':increment', buildSlideMotion('100%', '-100%')),
  transition(':decrement', buildSlideMotion('-100%', '100%'))
]);
