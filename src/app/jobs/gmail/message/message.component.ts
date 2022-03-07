import { Output, Input, Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread, Message, MessagePart } from '../interfaces';
import { pluck, map, concatMap, toArray, tap, finalize, mergeMap, throwIfEmpty, catchError, mergeMapTo, withLatestFrom } from 'rxjs/operators';
import { Observable, from, of, BehaviorSubject, EMPTY, pipe, OperatorFunction, MonoTypeOperatorFunction, combineLatest, Subject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { log } from 'prd-cdk';
import { Attachment } from '../interfaces';
import { GmailService } from '../services/gmail.service';
import { ReproJobDialogService } from '../../repro-jobs/services/repro-job-dialog.service';
import { Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { JobsApiService } from '../../services/jobs-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobCreatorService } from '../../services/job-creator.service';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { CustomersService } from 'src/app/services/customers.service';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {

  @ViewChild(AttachmentsComponent) attachmentsList: AttachmentsComponent;

  private _message: Message;
  @Input() set message(value: Message) {
    if (value instanceof Message) {
      this._message = value;
      this.expanded = this.message.hasAttachment && this.message.labelIds.every(label => label !== 'SENT');
    }
  }
  get message() {
    return this._message;
  }

  @Output()
  attachmentsConfirm = new Subject<Attachment[]>();

  busy$ = new BehaviorSubject<boolean>(false);

  expanded = false;

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  onCreateJob(attachments: Attachment[]) {
    this.attachmentsConfirm.next(attachments);
  }

}
