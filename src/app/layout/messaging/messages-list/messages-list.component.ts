import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit, Optional, TrackByFunction } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { delay, filter, mergeMap, take, takeUntil } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { JobData, Message, MessageFtpUser } from '../interfaces';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class MessagesListComponent implements OnInit, AfterViewInit {

  readonly messages$ = this.messaging.messages$;

  selected: Message | null = null;

  trackByFn: TrackByFunction<Message> = (idx, msg) => msg._id;

  constructor(
    private messaging: MessagingService,
    @Optional() private overlayRef: OverlayRef,
    private destroy$: DestroyService,
    @Inject(APP_PARAMS) private appParams: AppParams,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ftpUsers({ data }: Message): MessageFtpUser[] {
    return data instanceof JobData && data.operation === 'add' && data.ftpUsers || [];
  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id)
      .subscribe();
  }

  onMarkAsRead(id: string) {
    this.messaging.markOneRead(id)
      .subscribe();
  }

  onCreateJob(customer: MessageFtpUser, message: Message) {
    this.overlayRef?.detach();
    console.log('create job!', customer, message);
  }


}
