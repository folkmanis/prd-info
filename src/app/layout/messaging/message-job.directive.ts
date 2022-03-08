import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, HostListener, Input, Optional } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { last } from 'lodash';
import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { map, mapTo, mergeMapTo, pluck, switchMap, tap } from 'rxjs/operators';
import { Job, JobsApiService } from '../../jobs';
import { JobCreatorService } from '../../jobs/services/job-creator.service';
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
    private snack: MatSnackBar,
    private jobsApi: JobsApiService,
    @Optional() private overlayRef: OverlayRef,
    private jobCreator: JobCreatorService,
  ) { }

  @HostListener('click')
  onClick() {

    if (this.message?.data instanceof JobData && this.message.data.operation === 'add' && this.ftpUser instanceof MessageFtpUser) {

      this.overlayRef?.detach();
      const customer = this.ftpUser;
      const path = this.message.data.path;

      this.fileExists(path).pipe(
        switchMap(() => this.router.navigate(['/', 'jobs', 'repro'])),
        mergeMapTo(this.jobCreator.fromFtpFile(path, { customer: customer.CustomerName })), // to service
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

  private setMessageRead(msg: Message): MonoTypeOperatorFunction<Job> {

    return switchMap(job => msg.seen ? of(job) : this.messaging.markOneRead(this.message._id).pipe(mapTo(job)));

  }


}
