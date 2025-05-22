import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { cacheWithUpdate, combineReload } from 'src/app/library/rxjs';
import { LoginService } from 'src/app/login';
import { Message } from '../interfaces';
import { MessagesApiService } from './messages-api.service';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private reload$ = new Subject<void>();

  private update$ = new Subject<Message>();

  messages$: Observable<Message[]> = combineReload(this.login.user$, this.reload$).pipe(
    switchMap((user) => (user ? this.messagesApi.getAllMessages() : [])),
    cacheWithUpdate(this.update$, (m1, m2) => m1._id === m2._id),
    shareReplay(1),
  );

  messagesCount$: Observable<number> = this.messages$.pipe(map((messages) => messages.length));

  unreadCount$ = this.messages$.pipe(
    map((messages) => messages.reduce((count, msg) => count + +!msg.seen, 0)),
    shareReplay(1),
  );

  constructor(
    private login: LoginService,
    private messagesApi: MessagesApiService,
  ) {}

  reload() {
    this.reload$.next();
  }

  replaceOne(message: Message) {
    this.update$.next(message);
  }

  async markOneRead(id: string): Promise<void> {
    const message = await this.messagesApi.setOneMessageRead(id);
    this.replaceOne(message);
  }

  async markAllAsRead(): Promise<boolean> {
    const count = await this.messagesApi.setAllMessagesRead();
    if (count > 0) {
      this.reload();
    }
    return count > 0;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const count = await this.messagesApi.deleteMessage(id);
    if (count > 0) {
      this.reload();
    }
    return count > 0;
  }
}
