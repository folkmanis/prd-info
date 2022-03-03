import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GmailApiService } from './gmail-api.service';
import { ThreadsFilterQuery } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class GmailService {

  private readonly threadsFilter$ = new ReplaySubject<ThreadsFilterQuery>(1);

  threads$ = this.threadsFilter$.pipe(
    switchMap(filter => this.api.getThreads(filter)),
  );

  constructor(
    private api: GmailApiService,
  ) { }

  setThreadsFilter(filter: ThreadsFilterQuery) {
    this.threadsFilter$.next(filter);
  }

  thread(id: string) {
    return this.api.getThread(id);
  }

  message(id: string) {
    return this.api.getMessage(id);
  }
}
