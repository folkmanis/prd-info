import { Component, Input, Output, OnInit, ChangeDetectionStrategy, ViewChild, EventEmitter } from '@angular/core';
import { Message, FsOperations, JobMessageActions, JobFtpUpdate } from 'src/app/interfaces';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil, delay, auditTime, skipWhile, debounceTime, filter, map, mergeMap, finalize, share, shareReplay } from 'rxjs/operators';
import { log, DestroyService } from 'prd-cdk';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class MessagingComponent implements OnInit {

  @ViewChild(MatMenuTrigger) private trigger: MatMenuTrigger;

  messages$ = this.messaging.alertMessages$;

  messagesOpened$ = new Subject<MatMenuTrigger>();

  unreadCount$ = this.messages$.pipe(
    map(messages => messages.reduce((acc, curr) => acc + +(!curr.seen), 0)),
    shareReplay(1),
  );

  constructor(
    private messaging: MessagingService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.unreadCount$.pipe(
      filter(count => count > 0),
      mergeMap(_ => this.messagesOpened$),
      debounceTime(3000),
      filter(tr => tr.menuOpen),
      mergeMap(_ => this.messaging.markAllAsRead()),
      takeUntil(this.destroy$),
    )
      .subscribe();
  }

  onMessagesOpened() {
    this.messagesOpened$.next(this.trigger);
  }

  onMessagesClosed() {
    console.log('messages closed');
  }



}
