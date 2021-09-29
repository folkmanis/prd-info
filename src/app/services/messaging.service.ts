import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Message } from 'src/app/interfaces';
import { PrdApiService } from './prd-api/prd-api.service';
import { LoginService } from 'src/app/services/login.service';
import { asyncScheduler, combineLatest, interval, merge, Observable, of, OperatorFunction, pipe, scheduled, Subject } from 'rxjs';
import { filter, map, pluck, retry, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private reload$ = new Subject<void>();

  messages$: Observable<Message[]> = combineLatest([
    this.reload$.pipe(startWith('')),
    this.login.user$,
  ]).pipe(
    switchMap(([_, user]) => user ? this.api.messages.messages() : []),
    shareReplay(1),
  );

  messagesCount$: Observable<number> = this.messages$.pipe(
    map(messages => messages.length)
  );

  unreadCount$ = this.messages$.pipe(
    map(messages => messages.filter(msg => !msg.seen).length),
    shareReplay(1),
  );

  constructor(
    private api: PrdApiService,
    private login: LoginService,
  ) { }

  reload() {
    this.reload$.next();
  }

  markAllAsRead(): Observable<boolean> {
    return this.api.messages.setAllMessagesRead().pipe(
      map(n => n > 0),
      tap(resp => resp && this.reload()),
    );
  }

  deleteMessage(id: string): Observable<boolean> {
    return this.api.messages.deleteMessage(id).pipe(
      map(n => n > 0),
      tap(resp => resp && this.reload()),
    );
  }

}
