import { Inject, Injectable } from '@angular/core';
import { PrdApiService } from './prd-api/prd-api.service';
import { Notification, SystemNotification, Modules, ModulesWithNotifications } from 'src/app/interfaces';
import { Subject, Observable, interval, from, Subscriber, Subscription, EMPTY, fromEvent, combineLatest, timer, merge } from 'rxjs';
import { filter, finalize, map, mergeMap, share, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { DOCUMENT } from '@angular/common';

const INITIAL_DELAY = 3000;
const TIMER_INTERVAL = 3000;

const visibilityChange: SystemNotification = {
  _id: '',
  module: 'system',
  timestamp: new Date(),
  payload: {
    operation: 'visibilityState',
    id: 'visible',
  }
};

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private subscribedModules = new Map<ModulesWithNotifications, number>();

  private fromDate: Date | undefined;

  private visibilitychange$ = fromEvent(this.document, 'visibilitychange');

  private interval$: Observable<number> = this.visibilitychange$.pipe(
    startWith(''),
    map(_ => this.document.visibilityState === 'visible'),
    switchMap(visible => visible ? timer(INITIAL_DELAY, TIMER_INTERVAL) : EMPTY),
    // share(),
  );

  private comesVisible$: Observable<SystemNotification> = this.visibilitychange$.pipe(
    map(_ => this.document.visibilityState),
    filter(state => state === 'visible'),
    map(state => ({
      _id: '',
      module: 'system',
      timestamp: new Date(),
      payload: {
        operation: 'visibilityState',
        id: state,
      }
    })),
  );

  notifications$: Observable<Notification> = merge(
    this.interval$.pipe(
      map(_ => this.subscribed()),
      filter(modules => modules.length > 0),
      switchMap(modules => this.api.notifications.getNotification(modules, this.fromDate)),
      tap(resp => this.fromDate = resp.timestamp),
      mergeMap(resp => from(resp.data)),
    ),
    this.comesVisible$,
  ).pipe(
    share(),
  );

  constructor(
    private api: PrdApiService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  multiplex<T extends Notification, K extends T['module']>(module: K): Observable<T> {

    this.addModuleSubs(module);

    return this.notifications$.pipe(
      filter(ntf => ntf.module === module),
      finalize(() => {
        this.removeModuleSubs(module);
        console.log('modules final', this.subscribed());
      }),
    ) as Observable<T>;

  }


  private addModuleSubs(k: ModulesWithNotifications) {
    const m = this.subscribedModules.get(k) || 0;
    this.subscribedModules.set(k, m + 1);
  }

  private removeModuleSubs(k: ModulesWithNotifications) {
    const m = this.subscribedModules.get(k) || 0;
    if (m <= 1) {
      this.subscribedModules.delete(k);
    } else {
      this.subscribedModules.set(k, m - 1);
    }
  }

  private subscribed(): ModulesWithNotifications[] {
    return [...this.subscribedModules.keys()];
  }


}

