import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ReplaySubject, retry, timer } from 'rxjs';
import { ModulesWithNotifications, Notification } from 'src/app/interfaces';
import { MultiplexConfig, WsAuthSubject } from 'src/app/library/ws-token/ws-auth-subject';
import { LoginService } from 'src/app/login';
import { getAppParams } from '../app-params';

interface WsEvent {
  event?: 'auth';
  module?: ModulesWithNotifications;
  data: {
    token: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly wsPath = getAppParams('wsPath');
  private document = inject(DOCUMENT);
  private loginService = inject(LoginService);

  openObserver$: ReplaySubject<Event> = new ReplaySubject(1);

  wsNotifications = new WsAuthSubject<Notification | WsEvent>({
    url: this.wsUrl(),
  });

  wsMultiplex<T extends Notification, K extends T['module']>(module: K) {
    const multiplexConfig: MultiplexConfig<Notification | WsEvent> = {
      subMsg: (token) => ({
        event: 'subs',
        data: {
          module,
          token,
        },
      }),
      unsubMsg: () => ({
        event: 'unsubs',
        data: { module },
      }),
      messageFilter: (data) => data.module === module,
      tokenFn: () => this.loginService.sessionToken(),
    };

    return this.wsNotifications.multiplexAuth(multiplexConfig).pipe(
      retry({
        count: 10,
        delay: () => timer(5000),
        resetOnSuccess: true,
      }),
    );
  }

  private wsUrl(): string {
    const { protocol, host } = this.document.location;
    return protocol.replace(/^http/, 'ws') + '//' + host + this.wsPath;
  }
}
