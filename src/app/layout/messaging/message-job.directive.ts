import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'lodash';
import { map, mergeMap, pluck, switchMap, tap, from, MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
import { JobsApiService } from '../../jobs';
import { JobData, Message, MessageFtpUser } from './interfaces';
import { MessagingService } from './services/messaging.service';

export interface UserFile {
  name: string;
  size: number;
}


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
    private jobsApi: JobsApiService,
    @Optional() private overlayRef: OverlayRef,
    private reproJobService: ReproJobService,
    private userFileUploadService: UploadRefService,
  ) { }

  @HostListener('click')
  onClick() {

    if (this.message?.data instanceof JobData && this.message.data.operation === 'add' && this.ftpUser instanceof MessageFtpUser) {

      this.overlayRef?.detach();


      const path = this.message.data.path;

      const customer = this.ftpUser;
      const name = this.reproJobService.jobNameFromFiles([last(path)]);


      this.fileExists(path).pipe(
        map(() => this.userFileUploadService.ftpUploadRef(path)),
        tap(uploadRef => this.reproJobService.uploadRef = uploadRef),
        mergeMap(uploadRef => from(this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer: customer?.CustomerName }])).pipe(
          mergeMap(() => uploadRef.onAddedToJob()),
        )),
        this.setMessageRead(this.message),
      ).subscribe({
        error: (err) => console.log('upload aborted', err)
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

  private setMessageRead<T>(msg: Message): MonoTypeOperatorFunction<T> {

    return switchMap(arg => msg.seen ? of(arg) : this.messaging.markOneRead(this.message._id).pipe(map(() => arg)));

  }



}
