import { ChangeDetectionStrategy, Component, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { Attachment, Message } from '../interfaces';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnDestroy {

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

  busy$ = new BehaviorSubject<boolean>(false);

  markAsRead = true;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnDestroy(): void {
    this.busy$.complete();
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  onCreateJob(attachments: Attachment[]) {
    this.attachmentsConfirm.next(attachments);
  }

}
