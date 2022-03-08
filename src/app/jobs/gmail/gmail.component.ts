import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GmailService } from './services/gmail.service';
import { log } from 'prd-cdk';
import { pluck, map } from 'rxjs';
import { LabelListItem, ThreadsFilterQuery } from './interfaces';

@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GmailComponent implements OnInit {

  private filter: ThreadsFilterQuery = {
    maxResults: 20,
  };

  threads$ = this.gmail.threads$.pipe(
    pluck('threads'),
    map(threads => threads?.map(th => ({ ...th, html: this.sanitizer.bypassSecurityTrustHtml(th.snippet) })) || [])
  );

  labels$ = this.gmail.labels();

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
    this.gmail.setThreadsFilter(this.filter);
  }

  onReload() {
    this.gmail.reload();
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

}
