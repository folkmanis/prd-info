import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, concatMap, EMPTY, map, mergeMap, Observable, of, scan, shareReplay, take, tap } from 'rxjs';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { Thread, Threads, ThreadsFilterQuery } from './interfaces';
import { GmailService } from './services/gmail.service';


export type ThreadsListItem = Pick<Thread, 'id' | 'historyId' | 'snippet'>;

const DEFAULT_FILTER: ThreadsFilterQuery = {
  maxResults: 20,
  labelIds: ['CATEGORY_PERSONAL'],
};


@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GmailComponent {

  labelItems$ = this.gmail.labels().pipe(
    map(label => label.sort((a, b) => a.displayName.toUpperCase() > b.displayName.toUpperCase() ? 1 : -1)),
  );

  loading$ = new BehaviorSubject(true);

  loadingThread: Thread | null;

  threadsFilter$: Observable<ThreadsFilterQuery> = this.prefServ.userPreferences$.pipe(
    map(pref => ({ labelIds: pref.gmail.activeLabelId })),
    scan((acc, update) => ({ ...acc, ...update }), DEFAULT_FILTER),
    tap(() => this.threadsCache = []),
    shareReplay(1),
  );

  pageIdx$ = new BehaviorSubject<number>(0);

  threads$: Observable<Threads> = combineLatest({
    fltr: this.threadsFilter$,
    idx: this.pageIdx$,
  }).pipe(
    tap(() => this.loading$.next(true)),
    concatMap(({ fltr, idx }) => this.getThreadsPage(fltr, idx)),
    shareReplay(1),
  );

  lastPage$: Observable<boolean> = this.threads$.pipe(
    map(({ nextPageToken }) => !nextPageToken),
  );

  loadedCount$: Observable<number> = this.threads$.pipe(
    map(({ threads }) => threads?.length || 0),
  );

  datasource$: Observable<ThreadsListItem[]> = this.threads$.pipe(
    map(data => data.threads),
  );


  sanitize = (snippet: string) => this.sanitizer.bypassSecurityTrustHtml(snippet);

  private threadsCache: Threads[] = [];


  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
    private prefServ: JobsUserPreferencesService,
  ) { }



  onSetFilter(labelIds: string[]) {

    if (!Array.isArray(labelIds) || labelIds.length === 0) {
      return;
    }

    this.prefServ.userPreferences$.pipe(
      take(1),
      mergeMap(prefs => this.prefServ.setUserPreferences({ ...prefs, gmail: { ...prefs.gmail, activeLabelId: labelIds } }))
    ).subscribe();

  }

  onSetPageIdx(idx: number) {
    this.pageIdx$.next(idx);
  }


  private getThreadsPage(fltr: ThreadsFilterQuery, idx: number): Observable<Threads> {

    if (idx === 0) {
      this.threadsCache = [];
      return this.gmail.getThreads(fltr).pipe(
        tap(data => this.threadsCache.push(data)),
      );
    }

    if (this.threadsCache[idx]) {
      return of(this.threadsCache[idx]);
    }

    const pageToken = this.threadsCache[idx - 1]?.nextPageToken;

    if (!pageToken) {
      this.pageIdx$.next(0);
      return EMPTY;
    }

    return this.gmail.getThreads({ ...fltr, pageToken }).pipe(
      tap(data => this.threadsCache.push(data)),
    );

  }



}
