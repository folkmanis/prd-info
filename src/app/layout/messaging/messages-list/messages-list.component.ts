import {
  ChangeDetectionStrategy,
  Component,
  TrackByFunction,
} from '@angular/core';
import { DestroyService } from 'src/app/library/rxjs';
import { JobData, Message, MessageFtpUser } from '../interfaces';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class MessagesListComponent {
  readonly messages$ = this.messaging.messages$;

  selected: Message | null = null;

  trackByFn: TrackByFunction<Message> = (_, msg) => msg._id;

  constructor(private messaging: MessagingService) {}

  ftpUsers({ data }: Message): MessageFtpUser[] {
    return (
      (data instanceof JobData && data.operation === 'add' && data.ftpUsers) ||
      []
    );
  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id).subscribe();
  }

  onMarkAsRead(id: string) {
    this.messaging.markOneRead(id).subscribe();
  }
}
