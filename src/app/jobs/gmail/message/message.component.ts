import { ChangeDetectionStrategy, Component, inject, input, output, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { Attachment, Message } from '../interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AttachmentsComponent, MatExpansionModule, MatButtonModule, MatIcon, MatMenuModule, MatCardModule, MatProgressBarModule],
})
export class MessageComponent {
  private sanitizer = inject(DomSanitizer);

  attachmentsList = viewChild(AttachmentsComponent);

  message = input.required<Message>();

  attachmentsConfirm = output<Attachment[]>();

  busy = signal(false);

  markAsRead = true;

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  onCreateJob(attachments: Attachment[]) {
    this.attachmentsConfirm.emit(attachments);
  }
}
