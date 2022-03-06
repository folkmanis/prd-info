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


const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config


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
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    private readonly gmail: GmailService,
    private readonly jobDialog: ReproJobDialogService,
    private readonly jobService: JobService,
    private readonly jobsApi: JobsApiService,
    private readonly snack: MatSnackBar,
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
      pluck('names'),
      toArray(),
      map(files => files.reduce((acc, curr) => acc.concat(...curr), [])),
      mergeMap(fileNames => this.jobDialog.openJob(
        this.jobDataFromFiles(fileNames, message.text.join(';'))
      ).pipe(
        mergeMap(job => job ? this.jobService.newJob(job) : this.uploadCleanup(fileNames)),
        mergeMap(jobId => this.jobService.moveUserFilesToJob(jobId, fileNames)),
      )),
      finalize(() => this.busy$.value && this.busy$.next(false)),
    )
      .subscribe(job => this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 }));

  }

  private uploadCleanup(fileNames: string[]): Observable<never> {
    return this.jobsApi.deleteUserFiles(fileNames).pipe(
      mergeMapTo(EMPTY),
    );
  }

  private jobDataFromFiles(fileNames: string[], comment: string): Partial<Job> {

    return {
      name: fileNames
        .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
        .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
        .join('_'),
      receivedDate: new Date(),
      dueDate: new Date(),
      production: {
        category: 'repro',
      },
      jobStatus: {
        generalStatus: 20,
        timestamp: new Date(),
      },
      comment,
    };

  }


}
