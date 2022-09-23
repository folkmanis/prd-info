import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { map, merge, Observable, of, scan, Subject, takeUntil } from 'rxjs';
import { Threads, ThreadsFilterQuery } from './interfaces';
import { Thread } from './interfaces/thread';
import { GmailService } from './services/gmail.service';
import { MatPaginatorIntlLv } from './threads-paginator/mat-paginator-intl-lv';
import { ThreadsPaginatorDirective } from './threads-paginator/threads-paginator.directive';
import { ThreadsDatasource, ThreadsListItem } from './services/threads-datasource';
import { JobsUserPreferencesService } from '../services/jobs-user-preferences.service';
import { DestroyService } from 'prd-cdk';


@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLv },
    DestroyService,
  ]
})
export class GmailComponent implements OnInit, AfterViewInit {

  readonly initialPageSize = 100;
  readonly defaultLabel = 'CATEGORY_PERSONAL';

  datasource = new ThreadsDatasource(
    this.gmail.getThreads(),
    this.gmail.getThreadsCount(),
  );

  @ViewChild(ThreadsPaginatorDirective) private set threadsPaginator(value: ThreadsPaginatorDirective) {
    this.datasource.threadsPaginator = value;
  }

  private filter: ThreadsFilterQuery = {
    maxResults: this.initialPageSize,
    labelIds: [this.defaultLabel],
  };

  labels$ = this.gmail.labels();

  messagesTotal$ = this.gmail.label$.pipe(
    map(labels => labels.length === 1 ? labels[0].threadsTotal : undefined),
  );

  loading: Thread | null;

  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
    private prefServ: JobsUserPreferencesService,
    private destroy$: DestroyService,
  ) { }


  sanitize = (snippet: string) => this.sanitizer.bypassSecurityTrustHtml(snippet);

  ngOnInit(): void {

    this.prefServ.userPreferences$.pipe(
      map(pref => ({ labelIds: [pref.gmail.activeLabelId] })),
      takeUntil(this.destroy$),
    ).subscribe(filter => this.datasource.setFilter(filter));
  }

  ngAfterViewInit(): void {
    // this.setFilter({});
  }

  setFilter(filter: Partial<ThreadsFilterQuery>) {
    this.datasource.setFilter(filter);
    return;
    this.filter = {
      ...this.filter,
      ...filter,
    };
    if (this.threadsPaginator) {
      this.threadsPaginator.firstPage();
    } else {
      this.gmail.setThreadsFilter(this.filter);
    }
  }

  // setPaginator(event: PageEvent) {
  //   this.datasource.setPage(event);
  //   return;
  //   if (event.pageSize !== this.filter.maxResults) {
  //     this.filter.maxResults = event.pageSize;
  //     this.threadsPaginator.firstPage();
  //     return;
  //   }
  //   if (event.pageIndex === 0) {
  //     this.gmail.setThreadsFilter(this.filter);
  //     return;
  //   }
  //   this.gmail.setThreadsPage(event.pageIndex);
  // }

  private replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }


}
