import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { Attachment, Message } from '../interfaces';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AttachmentsComponent, MatExpansionModule, MatButtonModule, MatIconModule, MatMenuModule, MatCardModule, MatProgressBarModule, AsyncPipe],
})
export class MessageComponent {
  @ViewChild(AttachmentsComponent) attachmentsList: AttachmentsComponent;

  private _message: Message;
  @Input() set message(value: Message) {
    if (value instanceof Message) {
      this._message = value;
    }
  }
  get message() {
    return this._message;
  }

  @Output()
  attachmentsConfirm = new Subject<Attachment[]>();

  busy = signal(false);

  markAsRead = true;

  constructor(private sanitizer: DomSanitizer) {}

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  onCreateJob(attachments: Attachment[]) {
    this.attachmentsConfirm.next(attachments);
  }
}
