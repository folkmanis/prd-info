import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, combineLatest, Observable, interval, timer } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { LoginService, SystemPreferencesService } from 'src/app/services';
import { LayoutService } from './layout/layout.service';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from './app-params';
import { ApiVersionService } from 'src/app/library/http/api-version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {

  isLarge$ = this.layoutService.isLarge$;

  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isLarge$]).pipe(
    map(([user, large]) => !!user && large),
  );

  user$ = this.loginService.user$;

  activeModule$ = this.systemPreferencesService.activeModule$;

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    private layoutService: LayoutService,
    @Inject(APP_PARAMS) private params: AppParams,
    private apiVersion: ApiVersionService,
  ) { }

  ngOnInit() {
    this.apiVersion.version$.pipe(
      filter(ver => ver.appBuild > this.params.version.appBuild),
    ).subscribe(() => location.reload());
  }

  ngOnDestroy() {
  }

}
