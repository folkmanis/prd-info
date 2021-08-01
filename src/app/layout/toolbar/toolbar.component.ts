import { Component, OnInit, Output, EventEmitter, Inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService, SystemPreferencesService } from 'src/app/services';
import { User, AppParams, UserModule, Message } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';

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

  version = this.params.version.appBuild;

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
  ) { }


  ngOnInit(): void {
  }


}
