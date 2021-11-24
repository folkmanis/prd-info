import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { delay, retryWhen, take } from 'rxjs/operators';
import { AppParams, ModulesWithNotifications, Notification } from 'src/app/interfaces';
import { MultiplexConfig, WsAuthSubject } from 'src/app/library/ws-token/ws-auth-subject';
import { APP_PARAMS } from '../app-params';
import { PrdApiService } from './prd-api/prd-api.service';

interface WsEvent {
  event?: 'auth',
  module?: ModulesWithNotifications,
  data: {
    token: string,
  };
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  openObserver$: ReplaySubject<Event> = new ReplaySubject(1);

  wsNotifications = new WsAuthSubject<Notification | WsEvent>({
    url: this.wsUrl(),
  });

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(APP_PARAMS) private params: AppParams,
    private api: PrdApiService,
  ) { }

  wsMultiplex<T extends Notification, K extends T['module']>(module: K) {

    const multiplexConfig: MultiplexConfig<Notification | WsEvent> = {
      subMsg: (token) => ({
        event: 'subs',
        data: {
          module,
          token,
        }
      }),
      unsubMsg: () => ({
        event: 'unsubs',
        data: { module }
      }),
      messageFilter: data => data.module === module,
      tokenFn: () => this.api.login.getSessionToken(),
    };


    return this.wsNotifications.multiplexAuth(multiplexConfig).pipe(
      retryWhen(error => error.pipe(
        take(10),
        delay(5000),
      )),
    );

  }

  private wsUrl(): string {
    const { protocol, host } = this.document.location;
    return protocol.replace(/^http/, 'ws') + '//' + host + this.params.wsPath;
  }


}
