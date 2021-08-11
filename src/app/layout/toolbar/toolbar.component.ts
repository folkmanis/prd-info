import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, User, UserModule } from 'src/app/interfaces';
import { MessagingService, NotificationsService } from 'src/app/services';
import { LayoutService } from 'src/app/services';

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
    this.notifications.multiplex('system').pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(() => this.messagingService.reload());
  }


}
