import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { Observable, timer } from 'rxjs';
import { filter, mergeMap, pluck, share, take, takeUntil, throttleTime } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, SystemNotification, SystemOperations, User, UserModule } from 'src/app/interfaces';
import { LoginService } from 'src/app/login';
import { NotificationsService } from 'src/app/services';
import { LayoutService } from 'src/app/library';
import { MessagingService } from '../messaging/services/messaging.service';

const INITIAL_DELAY = 3000;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ToolbarComponent implements OnInit {


  @Input() user: User;

  @Input() activeModule: UserModule;

  @Output() sideMenuToggle = new EventEmitter<void>();

  version = this.params.version.appBuild;

  messagesCount$: Observable<number> = this.messagingService.messagesCount$;
  unreadMessagesCount$: Observable<number> = this.messagingService.unreadCount$;

  small$ = this.layout.isSmall$;

  private systemNotifications$ = timer(INITIAL_DELAY).pipe(
    take(1),
    mergeMap(_ => this.notifications.wsMultiplex('system') as Observable<SystemNotification>),
    throttleTime(500),
    takeUntil(this.destroy$),
    share(),
  );

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private destroy$: DestroyService,
    private layout: LayoutService,
    private loginService: LoginService,
  ) { }


  ngOnInit(): void {

    this.systemNotifications$.subscribe(() => this.messagingService.reload());

    this.systemNotifications$.pipe(
      pluck('payload'),
      filter(({ operation, id }) => operation === SystemOperations.USER_UPDATED && id === this.user.username),
    ).subscribe(() => this.loginService.reloadUser());


  }


}
