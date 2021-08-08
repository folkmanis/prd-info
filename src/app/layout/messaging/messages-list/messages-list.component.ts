import { AfterViewInit, Input, EventEmitter, Output, ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DestroyService, log } from 'prd-cdk';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, mergeMap, shareReplay, takeUntil } from 'rxjs/operators';
import { MessagingService } from 'src/app/services/messaging.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Message } from 'src/app/interfaces';
import { MessagesTriggerDirective } from '../messages-trigger.directive';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class MessagesListComponent implements OnInit, AfterViewInit {

  readonly messages$ = this.messaging.messages$;

  dropDown = false;

  @Output() readonly delete = new EventEmitter<Message>();

  constructor(
    private messaging: MessagingService,
    private notifications: NotificationsService,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.notifications.multiplex('system').pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(() => this.messaging.reload());
  }

  ngAfterViewInit() {
    this.messaging.unreadCount$.pipe(
      filter(count => count > 0),
      delay(3000),
      mergeMap(_ => this.messaging.markAllAsRead()),
      takeUntil(this.destroy$),
    )
      .subscribe(updated => updated && this.messaging.reload());

  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id).pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(resp => resp && this.messaging.reload());
  }


}
