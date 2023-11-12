import { Injectable } from '@angular/core';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import {
  map,
  mapTo,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { Message } from '../interfaces';
import { MessagesApiService } from './messages-api.service';
import { combineReload } from 'src/app/library/rxjs';
import { cacheWithUpdate } from 'src/app/library/rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private reload$ = new Subject<void>();

  private update$ = new Subject<Message>();

  messages$: Observable<Message[]> = combineReload(
    this.login.user$,
    this.reload$
  ).pipe(
    switchMap((user) => (user ? this.messagesApi.messages() : [])),
    cacheWithUpdate(this.update$, (m1, m2) => m1._id === m2._id),
    shareReplay(1)
  );

  messagesCount$: Observable<number> = this.messages$.pipe(
    map((messages) => messages.length)
  );

  unreadCount$ = this.messages$.pipe(
    map((messages) => messages.reduce((count, msg) => count + +!msg.seen, 0)),
    shareReplay(1)
  );

  constructor(
    private login: LoginService,
    private messagesApi: MessagesApiService
  ) {}

  reload() {
    this.reload$.next();
  }

  replaceOne(message: Message) {
    this.update$.next(message);
  }

  markOneRead(id: string): Observable<boolean> {
    return this.messagesApi.setOneMessageRead(id).pipe(
      tap((message) => this.replaceOne(message)),
      mapTo(true)
    );
  }

  markAllAsRead(): Observable<boolean> {
    return this.messagesApi.setAllMessagesRead().pipe(
      map((n) => n > 0),
      tap((resp) => resp && this.reload())
    );
  }

  deleteMessage(id: string): Observable<boolean> {
    return this.messagesApi.deleteMessage(id).pipe(
      map((n) => n > 0),
      tap((resp) => resp && this.reload())
    );
  }
}
