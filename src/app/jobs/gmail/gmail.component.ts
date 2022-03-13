import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GmailService } from './services/gmail.service';
import { log } from 'prd-cdk';
import { pluck, map } from 'rxjs';
import { LabelListItem, ThreadsFilterQuery } from './interfaces';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ThreadsPaginatorDirective } from './thread/threads-paginator.directive';

@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GmailComponent implements OnInit {

  @ViewChild(ThreadsPaginatorDirective) private threadsPaginator: ThreadsPaginatorDirective;

  private filter: ThreadsFilterQuery = {
    maxResults: 10,
    labelIds: ['CATEGORY_PERSONAL'],
  };

  threads$ = this.gmail.threads$.pipe(
    pluck('threads'),
    map(threads => threads?.map(th => ({ ...th, html: this.sanitizer.bypassSecurityTrustHtml(th.snippet) })) || []),
  );

  labels$ = this.gmail.labels();

  messagesTotal$ = this.gmail.label$.pipe(
    map(labels => labels.length === 1 ? labels[0].messagesTotal : undefined),
  );

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
    console.log('paginator', event);
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
