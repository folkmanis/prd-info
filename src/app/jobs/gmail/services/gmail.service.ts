import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { concatMap, map, pluck, shareReplay, single, startWith, switchMap, tap, toArray } from 'rxjs/operators';
import { combineReload } from 'src/app/library/rxjs/combine-reload';
import { Attachment, Threads, ThreadsFilterQuery } from '../interfaces';
import { GmailApiService } from './gmail-api.service';

function threadCache(
  filter$: Observable<ThreadsFilterQuery>,
  pageIndex$: Observable<number>,
  retrieveFn: (query: ThreadsFilterQuery) => Observable<Threads>,
): Observable<Threads> {

  let nextPageTokens: string[] = [];
  let pageIndex = 0;

  return combineLatest({
    filter: filter$.pipe(
      tap(_ => { nextPageTokens = []; pageIndex = 0; }),
    ),
    idx: pageIndex$.pipe(
      startWith(0),
      tap(idx => pageIndex = idx),
    )
  }).pipe(
    switchMap(({ filter }) => of({ ...filter, pageToken: nextPageTokens[pageIndex - 1] }).pipe(
      switchMap(query => retrieveFn(query)),
      tap(threads => nextPageTokens[pageIndex] = threads.nextPageToken),
    )),

  );
}



@Injectable({
  providedIn: 'root'
})
export class GmailService {

  private readonly threadsFilter$ = new ReplaySubject<ThreadsFilterQuery>(1);

  private readonly reload$ = new Subject<void>();

  private readonly page$ = new Subject<number>();

  threads$ = threadCache(
    combineReload(
      this.threadsFilter$,
      this.reload$
    ),
    this.page$,
    filter => this.api.getThreads(filter),
  );

  label$ = combineReload(
    this.threadsFilter$,
    this.reload$
  ).pipe(
    pluck('labelIds'),
    switchMap(ids => from(ids).pipe(
      concatMap(id => this.label(id)),
      toArray(),
    )),
    shareReplay(1),
  );

  constructor(
    private api: GmailApiService,
  ) { }

  setThreadsFilter(filter: ThreadsFilterQuery) {
    this.threadsFilter$.next(filter);
  }

  setThreadsPage(idx: number) {
    this.page$.next(idx);
  }

  reload() {
    this.reload$.next();
  }

  thread(id: string) {
    return this.api.getThread(id);
  }

  message(id: string) {
    return this.api.getMessage(id);
  }

  labels() {
    return this.api.getLabels();
  }

  label(id: string) {
    return this.api.getLabel(id);
  }

  saveAttachments(messageId: string, attachment: Attachment): Observable<string> {
    return this.api.attachmentToUserStorage(messageId, attachment).pipe(
      pluck('names'),
      single(fileNames => fileNames.length === 1),
      map(fileNames => fileNames[0]),
    );
  }
}
