import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, timer } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
  share,
  take,
  throttleTime,
} from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import {
  SystemNotification,
  SystemOperations,
  User,
  UserModule,
} from 'src/app/interfaces';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services';
import { MessagingService } from '../messaging/services/messaging.service';
import { MatMenuModule } from '@angular/material/menu';
import { MessagesTriggerDirective } from '../messaging/messages-trigger.directive';
import { MatBadgeModule } from '@angular/material/badge';
import { ViewSizeModule } from '../../library/view-size/view-size.module';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

const INITIAL_DELAY = 3000;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ViewSizeModule,
    MatBadgeModule,
    MessagesTriggerDirective,
    MatMenuModule,
    AsyncPipe,
  ],
})
export class ToolbarComponent implements OnInit {
  @Input() user: User;

  @Input() activeModule: UserModule;

  @Output() sideMenuToggle = new EventEmitter<void>();

  version = getAppParams('version', 'appBuild');

  messagesCount$: Observable<number> = this.messagingService.messagesCount$;
  unreadMessagesCount$: Observable<number> = this.messagingService.unreadCount$;

  private systemNotifications$ = timer(INITIAL_DELAY).pipe(
    take(1),
    mergeMap(
      (_) =>
        this.notifications.wsMultiplex(
          'system'
        ) as Observable<SystemNotification>
    ),
    throttleTime(500),
    takeUntilDestroyed(),
    share()
  );

  constructor(
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.systemNotifications$.subscribe(() => this.messagingService.reload());

    this.systemNotifications$
      .pipe(
        map(({ payload }) => payload),
        filter(
          ({ operation, id }) =>
            operation === SystemOperations.USER_UPDATED &&
            id === this.user.username
        )
      )
      .subscribe(() => this.loginService.reloadUser());
  }
}
