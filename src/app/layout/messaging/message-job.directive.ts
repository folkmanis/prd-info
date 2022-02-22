import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, HostListener, Input, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { last } from 'lodash';
import { EMPTY, MonoTypeOperatorFunction, Observable, of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, mapTo, mergeMap, mergeMapTo, pluck, switchMap, tap } from 'rxjs/operators';
import { PartialJob, ReproJobDialogService } from 'src/app/jobs/repro-jobs/services/repro-job-dialog.service';
import { Job, JobsApiService, JobService } from '../../jobs';
import { JobData, Message, MessageFtpUser } from './interfaces';
import { MessagingService } from './services/messaging.service';


class FileMissingError extends Error {
  constructor(fileName: string) {
    super(fileName);
    this.name = 'File Missing';
  }
}


@Directive({
  selector: '[appMessageJob]'
})
export class MessageJobDirective {

  @Input('appMessageJob') message: Message | null = null;

  @Input('appMessageJobFtpUser') ftpUser: MessageFtpUser | null = null;

  constructor(
    private router: Router,
    private messaging: MessagingService,
    private editDialogService: ReproJobDialogService,
    private jobService: JobService,
    private snack: MatSnackBar,
    private jobsApi: JobsApiService,
    @Optional() private overlayRef: OverlayRef,
  ) { }

  @HostListener('click')
  onClick() {
    if (this.message?.data instanceof JobData && this.message.data.operation === 'add' && this.ftpUser instanceof MessageFtpUser) {

      this.overlayRef?.detach();
      const customer = this.ftpUser;
      const path = this.message.data.path;

      this.fileExists(path).pipe(
        switchMap(() => this.router.navigate(['/', 'jobs', 'repro'])),
        mergeMapTo(this.editJob(customer.CustomerName, path)),
        this.createJobWithFiles(path),
        this.setMessageRead(this.message),
      ).subscribe({
        next: job => this.snack.open(`Fails ${last(path)} pievienots darbam ${job.jobId}`, 'OK', { duration: 3000 }),
        error: err => this.snack.open(`Neizdevās saglabāt darbu. ${err}`, 'OK'),
      });

    }


  }

  private fileExists(path: string[]): Observable<boolean> {
    const fileName = last(path);
    return this.jobsApi.readFtp(path[0]).pipe(
      pluck('files'),
      map(filelist => filelist.includes(fileName)),
      tap(isFile => {
        if (!isFile) throw new FileMissingError(fileName);
      })
    );
  }

  private editJob(CustomerName: string, path: string[]): Observable<PartialJob> {
    const fileName = last(path);

    return of(this.jobDataFromFiles(CustomerName, fileName)).pipe(
      mergeMap(job => this.editDialogService.openJob(job)),
      mergeMap(job => !job ? EMPTY : of(job)),
    );

  }

  private createJobWithFiles(path: string[]): OperatorFunction<PartialJob, Job> {
    return pipe(
      mergeMap(job => this.jobService.newJob(job)),
      mergeMap(jobId => this.jobService.copyFtpFilesToJob(jobId, [path])),
    );
  }

  private setMessageRead(msg: Message): MonoTypeOperatorFunction<Job> {

    return switchMap(job => msg.seen ? of(job) : this.messaging.markOneRead(this.message._id).pipe(mapTo(job)));

  }

  private jobDataFromFiles(customer: string, fileName: string): Partial<Job> {

    return {
      name: fileName.replace(/\.[^/.]+$/, ''),
      customer,
      receivedDate: new Date(),
      dueDate: new Date(),
      production: {
        category: 'repro',
      },
      jobStatus: {
        generalStatus: 20,
        timestamp: new Date(),
      },
    };

  }


}
