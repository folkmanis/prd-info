import { Observable, MonoTypeOperatorFunction, merge } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';

export function cacheWithUpdate<T>(
    update$: Observable<T>,
    compareFn: (o1: T, o2: T) => boolean
): MonoTypeOperatorFunction<T[]> {
    return (data$: Observable<T[]>): Observable<T[]> => {
        let cache: T[];
        return merge(
            data$.pipe(tap(d => cache = d)),
            update$.pipe(
                filter(_ => !!cache),
                map(item => {
                    const idx = cache.findIndex(pr => compareFn(pr, item));
                    if (idx > -1) {
                        const newCache = [...cache];
                        newCache[idx] = item;
                        cache = newCache;
                    }
                    return cache;
                })
            )
        );
    };
}
