import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { map, pluck } from 'rxjs';
import { ThreadsFilterQuery } from './interfaces';
import { GmailService } from './services/gmail.service';
import { MatPaginatorIntlLv } from './threads-paginator/mat-paginator-intl-lv';
import { ThreadsPaginatorDirective } from './threads-paginator/threads-paginator.directive';
import { Thread } from './interfaces/thread';


@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlLv },
  ]
})
export class GmailComponent implements OnInit {

  readonly initialPageSize = 10;
  readonly defaultLabel = 'CATEGORY_PERSONAL';

  @ViewChild(ThreadsPaginatorDirective) private threadsPaginator: ThreadsPaginatorDirective;

  private filter: ThreadsFilterQuery = {
    maxResults: this.initialPageSize,
    labelIds: [this.defaultLabel],
  };

  threads$ = this.gmail.threads$.pipe(
    pluck('threads'),
    map(threads => threads?.map(th => ({ ...th, html: this.sanitizer.bypassSecurityTrustHtml(th.snippet) })) || []),
  );

  labels$ = this.gmail.labels();

  messagesTotal$ = this.gmail.label$.pipe(
    map(labels => labels.length === 1 ? labels[0].messagesTotal : undefined),
  );

  loading: Thread | null;

  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  setFilter(filter: Partial<ThreadsFilterQuery>) {
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

  setPaginator(event: PageEvent) {
    if (event.pageSize !== this.filter.maxResults) {
      this.filter.maxResults = event.pageSize;
      this.threadsPaginator.firstPage();
      return;
    }
    if (event.pageIndex === 0) {
      this.gmail.setThreadsFilter(this.filter);
      return;
    }
    this.gmail.setThreadsPage(event.pageIndex);
  }

  onReload() {
    this.gmail.reload();
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

}
