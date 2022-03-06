import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, pluck, single, switchMap, toArray } from 'rxjs/operators';
import { GmailApiService } from './gmail-api.service';
import { Attachment, ThreadsFilterQuery } from '../interfaces';

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

  saveAttachments(messageId: string, attachment: Attachment): Observable<string> {
    return this.api.attachmentToUserStorage(messageId, attachment).pipe(
      pluck('names'),
      single(fileNames => fileNames.length === 1),
      map(fileNames => fileNames[0]),
    );
  }
}
