import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, TrackByFunction } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { delay, filter, mergeMap, take, takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/interfaces';
import { MessagingService } from 'src/app/services/messaging.service';

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
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.messaging.unreadCount$.pipe(
      take(1),
      filter(count => count > 0),
      delay(3000),
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
