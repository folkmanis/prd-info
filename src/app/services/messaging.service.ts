import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Message } from 'src/app/interfaces';
import { PrdApiService } from './prd-api/prd-api.service';
import { asyncScheduler, interval, merge, Observable, of, OperatorFunction, pipe, scheduled, Subject } from 'rxjs';
import { filter, map, pluck, retry, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private reload$ = new Subject<void>();

  messages$: Observable<Message[]> = this.reload$.pipe(
    switchMap(_ => this.api.login.messages()),
    pluck('data'),
    shareReplay(1),
  );

  constructor(
    private api: PrdApiService,
  ) { }

  reload() {
    this.reload$.next();
  }

  markAllAsRead(): Observable<boolean> {
    return this.api.login.setAllMessagesRead().pipe(
      map(n => n > 0),
    );
  }

  deleteMessage(id: string): Observable<boolean> {
    return this.api.login.deleteMessage(id).pipe(
      map(n => n > 0),
    );
  }

}
