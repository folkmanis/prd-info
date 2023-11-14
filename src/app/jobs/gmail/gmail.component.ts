import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  concatMap,
  map,
  mergeMap,
  of,
  scan,
  shareReplay,
  take,
  tap,
} from 'rxjs';
import { ScrollTopDirective } from '../../library/scroll-to-top/scroll-top.directive';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { GmailPaginatorComponent } from './gmail-paginator/gmail-paginator.component';
import { Thread, Threads, ThreadsFilterQuery } from './interfaces';
import { GmailService } from './services/gmail.service';
import { ThreadsFilterComponent } from './threads-filter/threads-filter.component';

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
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    ThreadsFilterComponent,
    GmailPaginatorComponent,
    MatProgressBarModule,
    MatTableModule,
    ScrollTopDirective,
    RouterLink,
    AsyncPipe,
  ],
})
export class GmailComponent {
  loading = signal(true);

  loadingThread: Thread | null;

  threadsFilter$: Observable<ThreadsFilterQuery> =
    this.preferences.userPreferences$.pipe(
      map((pref) => ({ labelIds: pref.gmail.activeLabelId })),
      scan((acc, update) => ({ ...acc, ...update }), DEFAULT_FILTER),
      tap(() => (this.threadsCache = [])),
      shareReplay(1)
    );

  pageIdx$ = new BehaviorSubject<number>(0);

  threads$: Observable<Threads> = combineLatest({
    fltr: this.threadsFilter$,
    idx: this.pageIdx$,
  }).pipe(
    tap(() => this.loading.set(true)),
    concatMap(({ fltr, idx }) => this.getThreadsPage(fltr, idx)),
    shareReplay(1)
  );

  lastPage$: Observable<boolean> = this.threads$.pipe(
    map(({ nextPageToken }) => !nextPageToken)
  );

  loadedCount$: Observable<number> = this.threads$.pipe(
    map(({ threads }) => threads?.length || 0)
  );

  datasource$: Observable<ThreadsListItem[]> = this.threads$.pipe(
    map((data) => data.threads)
  );

  sanitize = (snippet: string) =>
    this.sanitizer.bypassSecurityTrustHtml(snippet);

  private threadsCache: Threads[] = [];

  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
    private preferences: JobsUserPreferencesService
  ) {}

  onSetFilter(labelIds: string[]) {
    if (!Array.isArray(labelIds) || labelIds.length === 0) {
      return;
    }

    this.preferences.userPreferences$
      .pipe(
        take(1),
        mergeMap((prefs) =>
          this.preferences.setUserPreferences({
            ...prefs,
            gmail: { ...prefs.gmail, activeLabelId: labelIds },
          })
        )
      )
      .subscribe();
  }

  onSetPageIdx(idx: number) {
    this.pageIdx$.next(idx);
  }

  private getThreadsPage(
    fltr: ThreadsFilterQuery,
    idx: number
  ): Observable<Threads> {
    if (idx === 0) {
      this.threadsCache = [];
      return this.gmail
        .getThreads(fltr)
        .pipe(tap((data) => this.threadsCache.push(data)));
    }

    if (this.threadsCache[idx]) {
      return of(this.threadsCache[idx]);
    }

    const pageToken = this.threadsCache[idx - 1]?.nextPageToken;

    if (!pageToken) {
      this.pageIdx$.next(0);
      return EMPTY;
    }

    return this.gmail
      .getThreads({ ...fltr, pageToken })
      .pipe(tap((data) => this.threadsCache.push(data)));
  }
}
