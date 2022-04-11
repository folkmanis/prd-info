import { map, merge, Observable, scan } from 'rxjs';

export function combineReload<T>(data$: Observable<T>, ...reloads$: Observable<void>[]): Observable<T> {
    return merge(
        data$,
        ...reloads$
    ).pipe(
        scan((initial, val) => {
            if (!initial && !val) {
                throw new Error('Value must be supplied before reload');
            }
            return val || initial;
        }),
        map(value => value as T),
    );
}

