import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription, combineLatest, Observable, interval, timer } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { LoginService } from 'src/app/services';
import { LayoutService } from './layout/layout.service';
import { AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from './app-params';
import { ApiVersionService } from 'src/app/library/http/api-version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  isLarge$ = this.layoutService.isLarge$;

  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isLarge$]).pipe(
    map(([user, large]) => !!user && large),
  );

  constructor(
    private loginService: LoginService,
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
