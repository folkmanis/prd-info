import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'lodash-es';
import { map, mergeMap, pluck, switchMap, tap, from, MonoTypeOperatorFunction, Observable, of, catchError, EMPTY } from 'rxjs';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
import { JobsApiService } from '../../jobs';
import { JobData, Message, MessageFtpUser } from './interfaces';
import { MessagingService } from './services/messaging.service';
import { JobFilesService } from 'src/app/filesystem';

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
    selector: '[appMessageJob]',
    standalone: true
})
export class MessageJobDirective {

  @Input('appMessageJob') message: Message | null = null;

  @Input('appMessageJobFtpUser') ftpUser: MessageFtpUser | null = null;

  constructor(
    private router: Router,
    private messaging: MessagingService,
    @Optional() private overlayRef: OverlayRef,
    private reproJobService: ReproJobService,
    private userFileUploadService: UploadRefService,
    private filesService: JobFilesService,
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
        catchError(() => EMPTY)
      ).subscribe();

    }

  }

  private fileExists(path: string[]): Observable<boolean> {
    const fileName = last(path);
    return this.filesService.ftpFolders(path.slice(0, -1)).pipe(
      map(filelist => filelist.filter(val => !val.isFolder).map(val => val.name).includes(fileName)),
      tap(isFile => {
        if (!isFile) throw new FileMissingError(fileName);
      })
    );
  }

  private setMessageRead<T>(msg: Message): MonoTypeOperatorFunction<T> {

    return switchMap(arg => msg.seen ? of(arg) : this.messaging.markOneRead(this.message._id).pipe(map(() => arg)));

  }



}
