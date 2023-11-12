import {
  MonoTypeOperatorFunction,
  Observable,
  filter,
  map,
  merge,
  tap,
} from 'rxjs';

export function cacheWithUpdate<T>(
  update$: Observable<T>,
  compareFn: (o1: T, o2: T) => boolean
): MonoTypeOperatorFunction<T[]> {
  let cache: T[];
  return (data$: Observable<T[]>): Observable<T[]> => {
    return merge(
      data$.pipe(tap((d) => (cache = d))),
      update$.pipe(
        filter((_) => !!cache),
        map((upd) => {
          const idx = cache.findIndex((c) => compareFn(c, upd));
          if (idx > -1) {
            cache = [...cache.slice(0, idx), upd, ...cache.slice(idx + 1)];
          } else {
            cache = [upd, ...cache];
          }
          return cache;
        })
      )
    );
  };
}
