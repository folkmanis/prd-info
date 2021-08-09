import { Component, OnInit, Output, EventEmitter, Inject, ChangeDetectionStrategy, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LoginService, SystemPreferencesService } from 'src/app/services';
import { User, AppParams, UserModule, Message } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { MessagingService } from 'src/app/services/messaging.service';
import { DestroyService } from 'prd-cdk';
import { NotificationsService } from 'src/app/services/notifications.service';

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

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private messagingService: MessagingService,
    private notifications: NotificationsService,
    private destroy$: DestroyService,
  ) { }


  ngOnInit(): void {
    this.notifications.multiplex('system').pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(() => this.messagingService.reload());
  }


}
