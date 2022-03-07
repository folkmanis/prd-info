import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Thread, Message, MessagePart } from '../interfaces';
import { pluck, map, concatMap, toArray, tap, finalize, mergeMap, throwIfEmpty, catchError, mergeMapTo } from 'rxjs/operators';
import { Observable, from, of, BehaviorSubject, EMPTY, pipe, OperatorFunction, MonoTypeOperatorFunction } from 'rxjs';



@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadComponent implements OnInit {

  thread$: Observable<Thread> = this.route.data.pipe(
    pluck('thread'),
  );

  messages$: Observable<Message[]> = this.thread$.pipe(
    pluck('messages'),
  );

  from$ = this.thread$.pipe(
    pluck('from'),
  );


  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void { }

}
