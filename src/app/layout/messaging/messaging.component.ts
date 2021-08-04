import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DestroyService } from 'prd-cdk';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, mergeMap, shareReplay, takeUntil } from 'rxjs/operators';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class MessagingComponent implements OnInit, AfterViewInit {

  messages$ = this.messaging.messages$;

  messagesOpened$ = new Subject<MatMenuTrigger>();

  unreadCount$ = this.messages$.pipe(
    map(messages => messages.reduce((acc, curr) => acc + +(!curr.seen), 0)),
    shareReplay(1),
  );

  constructor(
    private messaging: MessagingService,
    private destroy$: DestroyService,
    private notifications: NotificationsService,
  ) { }

  ngOnInit(): void {

    this.notifications.multiplex('system').pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(() => this.messaging.reload());

    this.unreadCount$.pipe(
      filter(count => count > 0),
      mergeMap(_ => this.messagesOpened$),
      debounceTime(3000),
      filter(tr => tr.menuOpen),
      mergeMap(_ => this.messaging.markAllAsRead()),
      takeUntil(this.destroy$),
    )
      .subscribe(updated => updated && this.messaging.reload());
  }

  onMessagesOpened(trigger: MatMenuTrigger) {
    this.messagesOpened$.next(trigger);
  }

  ngAfterViewInit() {
    this.messaging.reload();
  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id)
      .subscribe(resp => resp && this.messaging.reload());
  }

}
