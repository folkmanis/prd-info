import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GmailService } from './services/gmail.service';
import { log } from 'prd-cdk';
import { pluck, map } from 'rxjs';

@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.scss']
})
export class GmailComponent implements OnInit {

  message$ = this.gmail.message('17f30e1fa1c55a35').pipe(
    log('message'),
  );

  threads$ = this.gmail.threads$.pipe(
    pluck('threads'),
    map(threads => threads.map(th => ({ ...th, html: this.sanitizer.bypassSecurityTrustHtml(th.snippet) })))
  );

  constructor(
    private gmail: GmailService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.gmail.setThreadsFilter({
      labelIds: ['CATEGORY_PERSONAL'],
      maxResults: 25,
    });
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

}
