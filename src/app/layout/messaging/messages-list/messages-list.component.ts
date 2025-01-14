import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, TrackByFunction } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { JobData, Message, MessageFtpUser } from '../interfaces';
import { MessageJobDirective } from '../message-job.directive';
import { MessagingService } from '../services/messaging.service';
import { RelativeDatePipe } from 'src/app/library/date-services';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, MessageJobDirective, AsyncPipe, RelativeDatePipe],
})
export class MessagesListComponent {
  private messaging = inject(MessagingService);

  readonly messages$ = this.messaging.messages$;

  selected: Message | null = null;

  trackByFn: TrackByFunction<Message> = (_, msg) => msg._id;

  ftpUsers({ data }: Message): MessageFtpUser[] {
    return (data instanceof JobData && data.operation === 'add' && data.ftpUsers) || [];
  }

  onDelete(id: string) {
    this.messaging.deleteMessage(id).subscribe();
  }

  onMarkAsRead(id: string) {
    this.messaging.markOneRead(id).subscribe();
  }
}
