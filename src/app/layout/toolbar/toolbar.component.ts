import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, input, model, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { filter, map, mergeMap, share, take, throttleTime } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import { SystemNotification, SystemOperations, User, UserModule } from 'src/app/interfaces';
import { ViewNotSmallDirective, ViewSmallDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services';
import { MessagesTriggerDirective } from '../messaging/messages-trigger.directive';
import { MessagingService } from '../messaging/services/messaging.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

const INITIAL_DELAY = 3000;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    MatToolbar,
    MatButtonModule,
    MatIcon,
    RouterLink,
    ViewNotSmallDirective,
    ViewSmallDirective,
    MatBadgeModule,
    MessagesTriggerDirective,
    MatMenuModule,
    AsyncPipe,
    MatSlideToggle,
  ],
})
export class ToolbarComponent implements OnInit {
  private messagingService = inject(MessagingService);
  private notifications = inject(NotificationsService);
  private loginService = inject(LoginService);

  private systemNotifications$ = timer(INITIAL_DELAY).pipe(
    take(1),
    mergeMap(() => this.notifications.wsMultiplex('system') as Observable<SystemNotification>),
    throttleTime(500),
    takeUntilDestroyed(),
    share(),
  );

  user = input.required<User>();

  activeModule = input<UserModule | null>(null);

  sideMenuToggle = output();

  darkMode = model(false);

  version = getAppParams('version', 'appBuild');

  messagesCount$: Observable<number> = this.messagingService.messagesCount$;
  unreadMessagesCount$: Observable<number> = this.messagingService.unreadCount$;

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
