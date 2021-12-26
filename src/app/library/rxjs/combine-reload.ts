import { map, merge, Observable, scan } from 'rxjs';

export function combineReload<T>(data$: Observable<T>, reload$: Observable<void>): Observable<T> {
    return merge(
        data$,
        reload$
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

