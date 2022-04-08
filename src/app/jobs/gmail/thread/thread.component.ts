import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { concatMap, finalize, map, mergeMap, pluck, toArray, withLatestFrom } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import { Job } from '../../interfaces';
import { JobCreatorService } from '../../services/job-creator.service';
import { Attachment, Message, Thread } from '../interfaces';
import { MessageComponent } from '../message/message.component';
import { GmailService } from '../services/gmail.service';
import { DomSanitizer } from '@angular/platform-browser';


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
    private jobCreator: JobCreatorService,
    private customers: CustomersService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void { }

  onCreateFromThread(thread: Thread) {


    const jobPreset: Partial<Job> = {
      comment: thread.plain,
      name: thread.subject,
    };

    const selected = this.messageList.filter(item => !!item.attachmentsList?.selected.length);

    if (selected.length === 0) {

      this.resolveCustomer(thread.from, jobPreset).pipe(
        mergeMap(job => this.jobCreator.newJob(job)),
      ).subscribe(job => {
        this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 });
      });

    } else {

      this.busy$.next(true);

      const attachments: { messageId: string, attachment: Attachment; }[] = selected
        .reduce((acc, curr) => [...acc, ...curr.attachmentsList.selected.map(item => ({ messageId: curr.message.id, attachment: item }))], []);

      from(attachments).pipe(
        concatMap(att => this.gmail.saveAttachments(att.messageId, att.attachment).pipe(
          map(name => ({ name, size: att.attachment.size })),
        )),
        toArray(),
        withLatestFrom(this.resolveCustomer(thread.from, jobPreset)),
        mergeMap(([fileNames, job]) => this.jobCreator.fromUserFiles(fileNames, job)),
        finalize(() => this.busy$.next(false)),
      )
        .subscribe(job => {
          this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 });
          selected.forEach(list => list.attachmentsList.deselectAll());
        });

    }

  }

  onCreateFromMessage(component: MessageComponent) {

    component.busy$.next(true);
    const message = component.message;
    const attachments = component.attachmentsList.selected;

    const jobPreset: Partial<Job> = {
      comment: message.plain,
    };

    from(attachments).pipe(
      concatMap(attachment => this.gmail.saveAttachments(message.id, attachment).pipe(
        map(name => ({ name, size: attachment.size })),
      )),
      toArray(),
      withLatestFrom(this.resolveCustomer(message.from, jobPreset)),
      mergeMap(([fileNames, job]) => this.jobCreator.fromUserFiles(fileNames, job)),
      finalize(() => component.busy$.next(false)),
    )
      .subscribe(job => {
        this.snack.open(`Darbs ${job.jobId}-${job.name} izveidots!`, 'OK', { duration: 5000 });
        component.attachmentsList.deselectAll();
      });

  }

  private resolveCustomer(from: string, job: Partial<Job>): Observable<Partial<Job>> {

    const email = extractEmail(from);

    return this.customers.getCustomerList({ email }).pipe(
      map(customers => customers.length === 1 ? customers[0].CustomerName : undefined),
      map(customer => ({ ...job, customer }))
    );

  }


}

function extractEmail(text: string): string {
  return text.match(/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi)[0];
}