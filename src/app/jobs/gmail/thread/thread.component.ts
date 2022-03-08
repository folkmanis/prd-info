import { ChangeDetectionStrategy, Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread, Message, MessagePart, Attachment } from '../interfaces';
import { pluck, map, concatMap, toArray, tap, finalize, mergeMap, throwIfEmpty, catchError, mergeMapTo, withLatestFrom } from 'rxjs/operators';
import { Observable, from, of, BehaviorSubject, EMPTY, pipe, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';
import { MessageComponent } from '../message/message.component';
import { GmailService } from '../services/gmail.service';
import { ReproJobDialogService } from '../../repro-jobs/services/repro-job-dialog.service';
import { Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { JobsApiService } from '../../services/jobs-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobCreatorService } from '../../services/job-creator.service';
import { CustomersService } from 'src/app/services/customers.service';


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


  constructor(
    private route: ActivatedRoute,
    private gmail: GmailService,
    private snack: MatSnackBar,
    private jobCreator: JobCreatorService,
    private customers: CustomersService,
  ) { }

  ngOnInit(): void { }

  onCreateFromThread(thread: Thread) {

    this.busy$.next(true);

    const selected = this.messageList.filter(item => !!item.attachmentsList?.selected.length);
    const attachments: { messageId: string, attachment: Attachment; }[] = selected
      .reduce((acc, curr) => [...acc, ...curr.attachmentsList.selected.map(item => ({ messageId: curr.message.id, attachment: item }))], []);

    const jobPreset: Partial<Job> = {
      comment: thread.plain,
      name: thread.subject,
    };

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

    const email = from.match(/[^<]+(?=>)/g)[0];

    return this.customers.getCustomerList({ email }).pipe(
      map(customers => customers.length === 1 ? customers[0].CustomerName : undefined),
      map(customer => ({ ...job, customer }))
    );

  }



}
