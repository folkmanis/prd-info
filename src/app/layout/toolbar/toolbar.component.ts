import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, timer } from 'rxjs';
import { filter, map, mergeMap, share, take, throttleTime } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import { SystemNotification, SystemOperations, User, UserModule } from 'src/app/interfaces';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services';
import { MessagingService } from '../messaging/services/messaging.service';

const INITIAL_DELAY = 3000;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    mergeMap(_ => this.notifications.wsMultiplex('system') as Observable<SystemNotification>),
    throttleTime(500),
    takeUntilDestroyed(),
    share(),
  );

  constructor(
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private loginService: LoginService,
  ) { }


  ngOnInit(): void {

    this.systemNotifications$.subscribe(() => this.messagingService.reload());

    this.systemNotifications$.pipe(
      map(({ payload }) => payload),
      filter(({ operation, id }) => operation === SystemOperations.USER_UPDATED && id === this.user.username),
    ).subscribe(() => this.loginService.reloadUser());


  }


}
