import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/index';
import { debounceTime, startWith } from 'rxjs/operators';
import { ArchiveRecord } from 'src/app/interfaces/xmf-search';
import { ArchiveSearchService } from '../services/archive-search.service';


export class SearchData extends DataSource<ArchiveRecord | undefined> {
  constructor(private service: ArchiveSearchService) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(ArchiveRecord | undefined)[]> {
    const range$ = collectionViewer.viewChange.pipe(
      startWith({ start: 0, end: 99 }),
      debounceTime(100),
    );
    return this.service.rangedData(range$);
  }

  disconnect() {
  }
}
