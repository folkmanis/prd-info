import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { Observable, of, timer } from 'rxjs';
import { debounceTime, takeUntil, delay, mergeMap, take, throttleTime } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { Notification, AppParams, User, UserModule, ModulesWithNotifications } from 'src/app/interfaces';
import { NotificationsService } from 'src/app/services';
import { LayoutService } from 'src/app/services';
import { MessagingService } from '../messaging/services/messaging.service';
import { DOCUMENT } from '@angular/common';

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

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private destroy$: DestroyService,
    private layout: LayoutService,
  ) { }


  ngOnInit(): void {
    timer(INITIAL_DELAY).pipe(
      take(1),
      mergeMap(_ => this.notifications.wsMultiplex('system')),
      throttleTime(500),
      takeUntil(this.destroy$),
    )
      .subscribe(() => this.messagingService.reload());

  }


}
