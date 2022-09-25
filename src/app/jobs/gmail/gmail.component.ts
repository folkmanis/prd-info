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

  datasource = new ThreadsDatasource(
    this.gmail.getThreads(),
    this.gmail.getThreadsCount(),
  );

  @ViewChild(ThreadsPaginatorDirective)
  set threadsPaginator(value: ThreadsPaginatorDirective) {
    this.datasource.threadsPaginator = value;
  }
  get threadsPaginator() {
    return this.datasource.threadsPaginator;
  }

  labels$ = this.gmail.labels();

  loading: Thread | null;

  sanitize = (snippet: string) => this.sanitizer.bypassSecurityTrustHtml(snippet);

  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
    private prefServ: JobsUserPreferencesService,
    private destroy$: DestroyService,
  ) { }



  ngOnInit(): void {
    this.prefServ.userPreferences$.pipe(
      map(pref => ({ labelIds: [pref.gmail.activeLabelId] })),
      takeUntil(this.destroy$),
    ).subscribe(filter => this.datasource.setFilter(filter));
  }

  ngAfterViewInit(): void {
  }

  setFilter(filter: Partial<ThreadsFilterQuery>) {
    this.datasource.setFilter(filter);
  }



}
