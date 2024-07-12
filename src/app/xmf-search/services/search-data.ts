import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/index';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { ArchiveRecord } from '../interfaces';
import { PagedCache } from './paged-cache';

export class SearchData extends DataSource<ArchiveRecord | undefined> {
  constructor(private cache: PagedCache<ArchiveRecord>) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(ArchiveRecord | undefined)[]> {
    return collectionViewer.viewChange.pipe(
      startWith({ start: 0, end: 99 }),
      debounceTime(100),
      switchMap((range) => this.cache.fetchRange(range)),
    );
  }

  disconnect() {}
}
