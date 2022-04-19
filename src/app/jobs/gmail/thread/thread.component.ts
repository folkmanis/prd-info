import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { concatMap, finalize, map, pluck, tap, toArray, withLatestFrom } from 'rxjs/operators';
import { UploadRefService } from 'src/app/jobs/repro-jobs/services/upload-ref.service';
import { CustomersService } from 'src/app/services/customers.service';
import { ReproJobService } from 'src/app/jobs/repro-jobs/services/repro-job.service';
import { Attachment, Message, Thread } from '../interfaces';
import { MessageComponent } from '../message/message.component';
import { GmailService } from '../services/gmail.service';


@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadComponent implements OnInit {

  @ViewChildren(MessageComponent) messageList: QueryList<MessageComponent>;

  thread$: Observable<Thread> = this.route.data.pipe(
    pluck('thread'),
  );

  busy$ = new BehaviorSubject<boolean>(false);

  replaceBr = (str: string) => this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));

  isExpanded = (msg: Message) => msg.hasPdf && msg.labelIds.every(label => label !== 'SENT');

  constructor(
    private route: ActivatedRoute,
    private gmail: GmailService,
    private customers: CustomersService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userFileUploadService: UploadRefService,
    private reproJobService: ReproJobService,
  ) { }

  ngOnInit(): void { }

  onCreateFromThread(thread: Thread) {

    const selected = this.messageList.filter(item => !!item.attachmentsList?.selected.length);

    if (selected.length === 0) {

      this.reproJobService.job = {
        comment: thread.plain,
      };
      const name = thread.subject;

      this.resolveCustomer(thread.from).pipe(
      ).subscribe(customer => this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer }]));

    } else {

      this.busy$.next(true);

      const attachments: { messageId: string, attachment: Attachment; }[] = selected
        .reduce((acc, curr) => [...acc, ...curr.attachmentsList.selected.map(item => ({ messageId: curr.message.id, attachment: item }))], []);

      this.createJobWithAttachments(attachments, thread).pipe(
        finalize(() => this.busy$.next(false)),
      ).subscribe();

    }

  }

  onCreateFromMessage(component: MessageComponent) {

    component.busy$.next(true);
    const message = component.message;
    const attachments = component.attachmentsList.selected
      .map(attachment => ({ messageId: message.id, attachment }));

    this.createJobWithAttachments(attachments, message).pipe(
      finalize(() => component.busy$.next(false)),
    ).subscribe();


  }

  private createJobWithAttachments(
    attachments: { messageId: string, attachment: Attachment; }[],
    messageOrThread: { from: string, plain: string; },
  ) {

    this.reproJobService.job = {
      comment: messageOrThread.plain,
    };


    return from(attachments).pipe(
      concatMap(att => this.gmail.saveAttachments(att.messageId, att.attachment)),
      toArray(),
      tap(fileNames => this.reproJobService.uploadRef = this.userFileUploadService.savedFileRef(fileNames)),
      withLatestFrom(this.resolveCustomer(messageOrThread.from)),
      map(([fileNames, customer]) => ({
        fileNames,
        customer,
        name: this.reproJobService.jobNameFromFiles(fileNames),
      })),
      tap(({ name, customer }) => this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer }])),
    );

  }

  private resolveCustomer(from: string): Observable<string | undefined> {

    const email = extractEmail(from);

    return this.customers.getCustomerList({ email }).pipe(
      map(customers => customers.length === 1 ? customers[0].CustomerName : undefined),
    );

  }


}

function extractEmail(text: string): string {
  return text.match(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)[0];
}