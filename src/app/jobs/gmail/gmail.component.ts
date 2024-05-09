import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  EMPTY,
  Observable,
  combineLatest,
  concatMap,
  filter,
  map,
  of,
  scan,
  shareReplay,
  tap
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

  private gmailService = inject(GmailService);
  private sanitizer = inject(DomSanitizer);
  private preferencesService = inject(JobsUserPreferencesService);

  private userPreferences = this.preferencesService.userPreferences;
  private gmailPreferences = computed(() => this.userPreferences()?.gmail);

  private threadsCache: Threads[] = [];

  loading = signal(true);

  loadingThread: Thread | null;

  pageIdx = signal(0);

  threadsFilter$: Observable<ThreadsFilterQuery> =
    toObservable(this.gmailPreferences).pipe(
      filter(preference => !!preference),
      map((preference) => ({ labelIds: preference.activeLabelId })),
      scan((acc, update) => ({ ...acc, ...update }), DEFAULT_FILTER),
      tap(() => (this.threadsCache = [])),
      shareReplay(1)
    );

  threads$: Observable<Threads> = combineLatest({
    fltr: this.threadsFilter$,
    idx: toObservable(this.pageIdx),
  }).pipe(
    tap(() => this.loading.set(true)),
    concatMap(({ fltr, idx }) => this.getThreadsPage(fltr, idx)),
    shareReplay(1)
  );

  threads = toSignal(this.threads$, { initialValue: new Threads() });

  lastPage = computed(() => !this.threads().nextPageToken);

  loadedCount = computed(() => this.threads().threads.length);

  datasource = computed(() => this.threads().threads);

  sanitize = (snippet: string) =>
    this.sanitizer.bypassSecurityTrustHtml(snippet);


  onSetFilter(labelIds: string[]) {
    if (!Array.isArray(labelIds) || labelIds.length === 0) {
      return;
    }

    this.preferencesService.patchUserPreferences(
      {
        gmail: {
          ...this.gmailPreferences(),
          activeLabelId: labelIds,
        }
      }
    );
  }

  onSetPageIdx(idx: number) {
    this.pageIdx.set(idx);
  }

  private getThreadsPage(
    fltr: ThreadsFilterQuery,
    idx: number
  ): Observable<Threads> {
    if (idx === 0) {
      this.threadsCache = [];
      return this.gmailService
        .getThreads(fltr)
        .pipe(tap((data) => this.threadsCache.push(data)));
    }

    if (this.threadsCache[idx]) {
      return of(this.threadsCache[idx]);
    }

    const pageToken = this.threadsCache[idx - 1]?.nextPageToken;

    if (!pageToken) {
      this.pageIdx.set(0);
      return EMPTY;
    }

    return this.gmailService
      .getThreads({ ...fltr, pageToken })
      .pipe(tap((data) => this.threadsCache.push(data)));
  }
}
