import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  viewChildren
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import {
  EMPTY,
  Observable,
  tap,
  withLatestFrom
} from 'rxjs';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
import { CustomersService } from 'src/app/services/customers.service';
import { UploadRef } from '../../repro-jobs/services/upload-ref';
import { Attachment, Message, Thread } from '../interfaces';
import { MessageComponent } from '../message/message.component';
import { GmailService } from '../services/gmail.service';

interface JobCreateResult {
  fileNames: string[];
  customer: string;
  name: string;
  uploadRef: UploadRef;
  comment: string,
}

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    MatProgressBarModule,
    MatExpansionModule,
    MatIconModule,
    MessageComponent,
  ],
})
export class ThreadComponent {

  private gmailService = inject(GmailService);
  private customersService = inject(CustomersService);
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private userFileUploadService = inject(UploadRefService);
  private reproJobService = inject(ReproJobService);

  private messageList = viewChildren(MessageComponent);

  thread = input.required<Thread>();

  busy = signal(false);

  replaceBr = (str: string) =>
    this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));

  isExpanded = (msg: Message) =>
    msg.hasPdf && msg.labelIds.every((label) => label !== 'SENT');

  async onCreateFromThread(thread: Thread) {

    this.busy.set(true);

    const selected = this.messageList().filter(
      (item) => item.attachmentsList?.selected.length > 0
    );

    if (selected.length === 0) {
      const customer = await this.resolveCustomer(thread.from);
      this.reproJobService.setJobTemplate({
        name: thread.subject,
        customer,
        comment: thread.plain,
      });
      this.navigateToNew();
    } else {
      const attachments: { messageId: string; attachment: Attachment; }[] =
        selected.reduce(
          (acc, curr) => [
            ...acc,
            ...curr.attachmentsList.selected.map((item) => ({
              messageId: curr.message.id,
              attachment: item,
            })),
          ],
          []
        );
      this.createJobWithAttachments(attachments, thread, EMPTY, thread.subject)
        .subscribe(() => this.navigateToNew());
    }
  }

  onCreateFromMessage(component: MessageComponent) {
    component.busy.set(true);
    const message = component.message;
    const attachments = component.attachmentsList.selected.map(
      (attachment) => ({ messageId: message.id, attachment })
    );

    this.createJobWithAttachments(attachments, message, this.markAsRead(component))
      .subscribe(() => this.navigateToNew());
  }

  private createJobWithAttachments(
    attachments: { messageId: string; attachment: Attachment; }[],
    messageOrThread: { from: string; plain: string; },
    afterAddedToJob: Observable<unknown>,
    name?: string
  ) {
    return this.gmailService.saveAttachments(attachments).pipe(
      withLatestFrom(this.resolveCustomer(messageOrThread.from)),
      tap(([fileNames, customer]) => {
        this.reproJobService.setJobTemplate({
          customer,
          name: name || this.reproJobService.jobNameFromFiles(fileNames),
          comment: messageOrThread.plain,
        });
        this.userFileUploadService.setSavedFile(fileNames, afterAddedToJob);
      }),
    );
  }

  private markAsRead(component: MessageComponent): Observable<unknown> {
    return component.markAsRead ? this.gmailService.markAsRead(component.message) : EMPTY;
  }

  private async resolveCustomer(from: string): Promise<string | undefined> {
    const email = extractEmail(from);

    const customers = await this.customersService
      .getCustomerList({ email });
    return customers.length === 1 ? customers[0].CustomerName : undefined;
  }

  private navigateToNew() {

    this.router.navigate(['/', 'jobs', 'repro', 'new']);
  }
}

function extractEmail(text: string): string {
  return text.match(
    /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
  )[0];
}
