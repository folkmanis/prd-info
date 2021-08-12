import { Inject, Injectable } from '@angular/core';
import { PrdApiService } from './prd-api/prd-api.service';
import { Notification, SystemNotification, Modules, ModulesWithNotifications, GlobalNotification } from 'src/app/interfaces';
import { Subject, Observable, interval, from, Subscriber, Subscription, EMPTY, fromEvent, combineLatest, timer, merge, Observer } from 'rxjs';
import { filter, finalize, map, mergeMap, retry, share, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { log } from 'prd-cdk';
import { DOCUMENT } from '@angular/common';
import { HttpCacheService } from '../library/http/http-cache.service';

const INITIAL_DELAY = 3000;
const TIMER_INTERVAL = 3000;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private subscribedModulesMap = new Map<ModulesWithNotifications, number>();

  private fromDate: Date | undefined;

  private visibilitychange$ = fromEvent(this.document, 'visibilitychange');

  private interval$: Observable<number> = this.visibilitychange$.pipe(
    startWith(''),
    map(_ => this.document.visibilityState === 'visible'),
    switchMap(visible => visible ? timer(INITIAL_DELAY, TIMER_INTERVAL) : EMPTY),
  );

  private comesVisible$: Observable<GlobalNotification> = this.visibilitychange$.pipe(
    map(_ => this.document.visibilityState),
    filter(state => state === 'visible'),
    map(state => ({
      _id: '',
      module: 'global',
      timestamp: new Date(),
      payload: {
        operation: 'visibilityState',
        state,
      }
    })),
  );

  notifications$: Observable<Notification> = merge(
    this.interval$.pipe(
      map(_ => this.subscribedModules()),
      filter(modules => modules.length > 0),
      switchMap(modules => this.api.notifications.getNotification(modules, this.fromDate).pipe(
        retry(3),
      )),
      tap(resp => this.fromDate = resp.timestamp),
      mergeMap(resp => from(resp.data)),
      tap(() => this.cache.clear()),
    ),
    this.comesVisible$,
  ).pipe(
    share(),
  );

  constructor(
    private api: PrdApiService,
    private cache: HttpCacheService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  multiplex<T extends Notification, K extends T['module']>(module: K): Observable<T> {


    return new Observable<T>(subscriber => {

      this.addModuleSubs(module);

      const subscription = this.notifications$.pipe(
        filter(ntf => ntf.module === module || ntf.module === 'global'),
      )
        .subscribe(notification => subscriber.next(notification as T));

      return () => {
        this.removeModuleSubs(module);
        subscription.unsubscribe();
      };
    });

  }


  private addModuleSubs(k: ModulesWithNotifications) {
    const m = this.subscribedModulesMap.get(k) || 0;
    this.subscribedModulesMap.set(k, m + 1);
  }

  private removeModuleSubs(k: ModulesWithNotifications) {
    const m = this.subscribedModulesMap.get(k) || 0;
    if (m <= 1) {
      this.subscribedModulesMap.delete(k);
    } else {
      this.subscribedModulesMap.set(k, m - 1);
    }
  }

  private subscribedModules(): ModulesWithNotifications[] {
    return [...this.subscribedModulesMap.keys()];
  }


}

