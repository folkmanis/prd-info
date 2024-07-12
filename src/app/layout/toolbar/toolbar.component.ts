import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { filter, map, mergeMap, share, take, throttleTime } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import { SystemNotification, SystemOperations, User, UserModule } from 'src/app/interfaces';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services';
import { ViewSizeModule } from '../../library/view-size/view-size.module';
import { MessagesTriggerDirective } from '../messaging/messages-trigger.directive';
import { MessagingService } from '../messaging/services/messaging.service';

const INITIAL_DELAY = 3000;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, ViewSizeModule, MatBadgeModule, MessagesTriggerDirective, MatMenuModule, AsyncPipe],
})
export class ToolbarComponent implements OnInit {
  user = input.required<User>();

  activeModule = input<UserModule | null>(null);

  sideMenuToggle = output();

  version = getAppParams('version', 'appBuild');

  messagesCount$: Observable<number> = this.messagingService.messagesCount$;
  unreadMessagesCount$: Observable<number> = this.messagingService.unreadCount$;

  private systemNotifications$ = timer(INITIAL_DELAY).pipe(
    take(1),
    mergeMap((_) => this.notifications.wsMultiplex('system') as Observable<SystemNotification>),
    throttleTime(500),
    takeUntilDestroyed(),
    share(),
  );

  constructor(
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.systemNotifications$.subscribe(() => this.messagingService.reload());

    this.systemNotifications$
      .pipe(
        map(({ payload }) => payload),
        filter(({ operation, id }) => operation === SystemOperations.UserUpdated && id === this.user().username),
      )
      .subscribe(() => this.loginService.reloadUser());
  }
}
