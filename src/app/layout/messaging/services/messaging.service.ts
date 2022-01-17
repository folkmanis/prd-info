import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { Message } from '../interfaces';
import { MessagesApiService } from './messages-api.service';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private reload$ = new Subject<void>();

  messages$: Observable<Message[]> = combineLatest([
    this.reload$.pipe(startWith('')),
    this.login.user$,
  ]).pipe(
    switchMap(([_, user]) => user ? this.messagesApi.messages() : []),
    shareReplay(1),
  );

  messagesCount$: Observable<number> = this.messages$.pipe(
    map(messages => messages.length)
  );

  unreadCount$ = this.messages$.pipe(
    map(messages => messages.reduce((count, msg) => count + +!msg.seen, 0)),
    shareReplay(1),
  );

  constructor(
    private login: LoginService,
    private messagesApi: MessagesApiService,
  ) { }

  reload() {
    this.reload$.next();
  }

  markAllAsRead(): Observable<boolean> {
    return this.messagesApi.setAllMessagesRead().pipe(
      map(n => n > 0),
      tap(resp => resp && this.reload()),
    );
  }

  deleteMessage(id: string): Observable<boolean> {
    return this.messagesApi.deleteMessage(id).pipe(
      map(n => n > 0),
      tap(resp => resp && this.reload()),
    );
  }

}
