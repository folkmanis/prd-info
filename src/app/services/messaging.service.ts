import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Message } from 'src/app/interfaces';
import { PrdApiService } from './prd-api/prd-api.service';
import { asyncScheduler, interval, merge, Observable, of, OperatorFunction, pipe, scheduled, Subject } from 'rxjs';
import { filter, map, retry, share, shareReplay, switchMap, tap } from 'rxjs/operators';

const POLLING_INTERVAL = 3000; // ms

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private readonly retrieveFn = this.api.login.messages.bind(this.api.login);

  private reload$ = new Subject<void>();

  messages$: Observable<Message[]> = messageCache(
    this.retrieveFn,
    interval(POLLING_INTERVAL).pipe(
      filter(_ => this.document.visibilityState === 'visible'),
    ),
    this.reload$
  ).pipe(
    shareReplay(1),
  );

  alertMessages$ = this.messages$.pipe(
    map(messages => messages.filter(msg => msg.alert))
  );

  constructor(
    private api: PrdApiService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  markAllAsRead(): Observable<boolean> {
    return this.api.login.setAllMessagesRead().pipe(
      map(n => n > 0),
      tap(isUpdated => isUpdated && this.reload$.next())
    );
  }


}

function messageCache(
  retrieveFn: (timestamp?: Date) => Observable<{ data: Message[], timestamp: Date; }>,
  interval$: Observable<number>,
  reload$: Observable<void>,
): Observable<Message[]> {

  let cache: Message[] = [];
  let timestamp: Date | undefined;

  return merge(
    reload$.pipe(
      tap(_ => {
        timestamp = undefined;
        cache = [];
      }),
    ),
    interval$
  ).
    pipe(
      switchMap(_ => retrieveFn(timestamp)),
      retry(5),
      tap(resp => timestamp = resp.timestamp),
      filter(resp => resp.data.length > 0),
      tap(resp => cache = resp.data.concat(cache)),
      map(_ => cache),
    );
}
