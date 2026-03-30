import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { PagedCache } from '../../library/rxjs/paged-cache';

export class SearchData<T> extends DataSource<T | undefined> {
  constructor(private cache: PagedCache<T>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    return collectionViewer.viewChange.pipe(
      startWith({ start: 0, end: 99 }),
      debounceTime(100),
      switchMap((range) => this.cache.fetchRange(range)),
    );
  }

  disconnect() {}
}
