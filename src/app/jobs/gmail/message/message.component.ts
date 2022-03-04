import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread, Message, MessagePart } from '../interfaces';
import { pluck, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {

  thread$: Observable<Thread> = this.route.data.pipe(
    pluck('thread'),
  );

  messages$: Observable<Message[]> = this.thread$.pipe(
    pluck('messages'),
    // map(messages => messages.map(msg => msg.payload))
  );

  from$ = this.thread$.pipe(
    pluck('from'),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
  }

  replaceBr(str: string) {
    return this.sanitizer.bypassSecurityTrustHtml(str?.replace(/\r\n/g, '<br />'));
  }

}
