import { ChangeDetectionStrategy, Component, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Subject } from 'rxjs';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { Attachment, Message } from '../interfaces';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgIf, AsyncPipe } from '@angular/common';


@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AttachmentsComponent,
        NgIf,
        MatExpansionModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCardModule,
        MatProgressBarModule,
        AsyncPipe,
    ],
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
