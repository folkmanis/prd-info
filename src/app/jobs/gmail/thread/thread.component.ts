import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { concatMap, finalize, map, mergeMap, pluck, tap, toArray, withLatestFrom } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import { Job } from '../../interfaces';
import { JobCreatorService } from '../../services/job-creator.service';
import { Attachment, Message, Thread } from '../interfaces';
import { MessageComponent } from '../message/message.component';
import { GmailService } from '../services/gmail.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserFileUploadService } from 'src/app/jobs/repro-jobs/services/user-file-upload.service';
import { UploadRef } from 'src/app/jobs/repro-jobs/services/upload-ref';
import { ReproJobService } from '../../repro-jobs/services/repro-job.service';


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
    private snack: MatSnackBar,
    private customers: CustomersService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private userFileUploadService: UserFileUploadService,
    private reproJobService: ReproJobService,
  ) { }

  ngOnInit(): void { }

  onCreateFromThread(thread: Thread) {

    this.reproJobService.job = {
      comment: thread.plain,
    };

    const selected = this.messageList.filter(item => !!item.attachmentsList?.selected.length);

    if (selected.length === 0) {

      const name = thread.subject;
      this.resolveCustomer(thread.from).pipe(
      ).subscribe(customer => this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer }]));

    } else {

      this.busy$.next(true);

      const attachments: { messageId: string, attachment: Attachment; }[] = selected
        .reduce((acc, curr) => [...acc, ...curr.attachmentsList.selected.map(item => ({ messageId: curr.message.id, attachment: item }))], []);

      from(attachments).pipe(
        concatMap(att => this.gmail.saveAttachments(att.messageId, att.attachment)),
        toArray(),
        withLatestFrom(this.resolveCustomer(thread.from)),
        // tap(([fileNames, customer])=> this.reproJobService.uploadRef=this.userFileUploadService.savedFileRef(fileNames)),
        // mergeMap(([fileNames, customer]) => this.jobCreator.fromUserFiles(fileNames, job)),
        finalize(() => this.busy$.next(false)),
      )
        .subscribe(([fileNames, customer]) => {
          const name = this.reproJobService.jobNameFromFiles(fileNames);
          this.reproJobService.uploadRef = this.userFileUploadService.savedFileRef(fileNames);
          this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer }]);
        });

    }

  }

  onCreateFromMessage(component: MessageComponent) {

    component.busy$.next(true);
    const message = component.message;
    const attachments = component.attachmentsList.selected;

    this.reproJobService.job = {
      comment: message.plain,
    };

    from(attachments).pipe(
      concatMap(attachment => this.gmail.saveAttachments(message.id, attachment)),
      toArray(),
      withLatestFrom(this.resolveCustomer(message.from)),
      // mergeMap(([fileNames, job]) => this.jobCreator.fromUserFiles(fileNames, job)),
      finalize(() => component.busy$.next(false)),
    )
      .subscribe(([fileNames, customer]) => {
        const name = this.reproJobService.jobNameFromFiles(fileNames);
        this.reproJobService.uploadRef = this.userFileUploadService.savedFileRef(fileNames);
        this.router.navigate(['/', 'jobs', 'repro', 'new', { name, customer }]);
      });

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