import { Input, Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread, Message, MessagePart } from '../interfaces';
import { pluck, map, concatMap, toArray, tap, finalize, mergeMap, throwIfEmpty, catchError, mergeMapTo } from 'rxjs/operators';
import { Observable, from, of, BehaviorSubject, EMPTY, pipe, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';
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



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {

  @ViewChild(AttachmentsComponent) private attachmentsList: AttachmentsComponent;

  @Input() message: Message;

  busy$ = new BehaviorSubject<boolean>(false);

  constructor(
    private sanitizer: DomSanitizer,
    private gmail: GmailService,
    private snack: MatSnackBar,
    private jobCreator: JobCreatorService,
  ) { }

  ngOnInit(): void {
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

  createJob(attachments: Attachment[]) {

    this.busy$.next(true);

    from(attachments).pipe(
      concatMap(attachment => this.gmail.saveAttachments(this.message.id, attachment)),
      toArray(),
      mergeMap(fileNames => this.jobCreator.fromUserFiles(fileNames, { comment: this.message.plain })),
      finalize(() => this.busy$.value && this.busy$.next(false)),
    )
      .subscribe(job => {
        this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 });
        this.attachmentsList.deselect(attachments);
      });

  }



}
