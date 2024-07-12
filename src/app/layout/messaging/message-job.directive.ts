import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'lodash-es';
import { EMPTY, Observable } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
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
  selector: '[appMessageJob]',
  standalone: true,
  host: {
    '(click)': 'onClick()'
  }
})
export class MessageJobDirective {

  private router = inject(Router);
  private messaging = inject(MessagingService);
  private overlayRef = inject(OverlayRef, { optional: true });
  private reproJobService = inject(ReproJobService);
  private uploadRefService = inject(UploadRefService);
  private filesService = inject(JobFilesService);

  message = input<Message | null>(null, { alias: 'appMessageJob' });

  ftpUser = input<MessageFtpUser | null>(null, { alias: 'appMessageJobFtpUser' });

  async onClick() {

    const message = this.message();
    const ftpUser = this.ftpUser();

    if (message?.data instanceof JobData && message.data.operation === 'add' && ftpUser instanceof MessageFtpUser) {

      this.overlayRef?.detach();

      const path = message.data.path;

      const name = this.reproJobService.jobNameFromFiles([last(path)]);

      const afterAddedToJob = this.setMessageRead(message);

      if (await this.fileExists(path)) {
        this.uploadRefService.setFtpUpload(path, afterAddedToJob);
        this.reproJobService.setJobTemplate({
          name,
          customer: ftpUser?.CustomerName,
        });
        await this.router.navigate(['/', 'jobs', 'repro', 'new']);
      } else {
        console.error(`File missing: ${name}`);
      }

    }

  }

  private async fileExists(path: string[]): Promise<boolean> {
    const fileName = last(path);

    return (await this.filesService.ftpFolders(path.slice(0, -1)))
      .filter(element => !element.isFolder)
      .some(file => file.name === fileName);
  }

  private setMessageRead(message: Message): Observable<unknown> {
    return message.seen ? EMPTY : this.messaging.markOneRead(message._id);
  }



}
