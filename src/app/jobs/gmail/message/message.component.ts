import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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



@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {

  busy$ = new BehaviorSubject<boolean>(false);

  thread$: Observable<Thread> = this.route.data.pipe(
    pluck('thread'),
  );

  messages$: Observable<Message[]> = this.thread$.pipe(
    pluck('messages'),
  );

  from$ = this.thread$.pipe(
    pluck('from'),
  );

  constructor(
    private route: ActivatedRoute,
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

  createJob(message: Message, attachments: Attachment[]) {

    this.busy$.next(true);

    from(attachments).pipe(
      concatMap(attachment => this.gmail.saveAttachments(message.id, attachment)),
      toArray(),
      mergeMap(fileNames => this.jobCreator.fromUserFiles(fileNames, { comment: message.text.join(';') })),
      finalize(() => this.busy$.value && this.busy$.next(false)),
    )
      .subscribe(job => this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 }));

  }



}
