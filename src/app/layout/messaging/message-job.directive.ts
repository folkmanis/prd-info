import { OverlayRef } from '@angular/cdk/overlay';
import { Directive, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'lodash-es';
import { JobFilesService } from 'src/app/filesystem';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
import { notNullOrThrow } from 'src/app/library';
import { JobMessageData, Message, MessageFtpUser } from './interfaces';
import { MessagingService } from './services/messaging.service';

export interface UserFile {
  name: string;
  size: number;
}

@Directive({
  selector: '[appMessageJob]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class MessageJobDirective {
  #router = inject(Router);
  #messaging = inject(MessagingService);
  #overlayRef = inject(OverlayRef, { optional: true });
  #reproJobService = inject(ReproJobService);
  #uploadRefService = inject(UploadRefService);
  #filesService = inject(JobFilesService);

  message = input<Message | null>(null, { alias: 'appMessageJob' });

  ftpUser = input<MessageFtpUser | null>(null, { alias: 'appMessageJobFtpUser' });

  async onClick() {
    const message = this.message();
    const ftpUser = MessageFtpUser.nullable().parse(this.ftpUser());

    if (message?.data instanceof JobMessageData && message.data.operation === 'add') {
      this.#overlayRef?.detach();

      const path = message.data.path;
      const filename = notNullOrThrow(last(path), 'Filename is null');
      const name = this.#reproJobService.jobNameFromFiles([filename]);

      if (await this.#checkFileExists(path)) {
        this.#uploadRefService.setFtpUpload(path, this.#setMessageReadFn(message));
        this.#reproJobService.setJobTemplate({
          name,
          customer: ftpUser?.CustomerName,
        });
        await this.#router.navigate(['/', 'jobs', 'repro', 'new']);
      } else {
        // eslint-disable-next-line no-console
        console.error(`File missing: ${name}`);
      }
    }
  }

  async #checkFileExists(path: string[]): Promise<boolean> {
    const fileName = last(path);
    const folders = await this.#filesService.ftpFolders(path.slice(0, -1));

    return folders.filter((element) => !element.isFolder).some((file) => file.name === fileName);
  }

  #setMessageReadFn({ seen, _id }: Message): () => void {
    return () => !seen && this.#messaging.markOneRead(_id);
  }
}
