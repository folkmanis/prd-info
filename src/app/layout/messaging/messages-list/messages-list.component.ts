import { AfterViewInit, Inject, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, TrackByFunction } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { delay, filter, mergeMap, take, takeUntil } from 'rxjs/operators';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { MessagingService } from '../services/messaging.service';
import { Message } from '../interfaces';

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

  trackByFn: TrackByFunction<Message> = (idx, msg) => msg._id;

  constructor(
    private messaging: MessagingService,
    private destroy$: DestroyService,
    @Inject(APP_PARAMS) private appParams: AppParams,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.messaging.unreadCount$.pipe(
      take(1),
      filter(count => count > 0),
      delay(this.appParams.messagesReadDelay),
      mergeMap(_ => this.messaging.markAllAsRead()),
      takeUntil(this.destroy$),
    )
      .subscribe();

  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id).pipe(
      takeUntil(this.destroy$),
    )
      .subscribe();
  }


}
