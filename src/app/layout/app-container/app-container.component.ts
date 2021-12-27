import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutService, SystemPreferencesService } from 'src/app/services';
import { LoginService } from 'src/app/login';


@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent implements OnInit {

  isLarge$ = this.layoutService.isLarge$;

  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isLarge$]).pipe(
    map(([user, large]) => !!user && large),
  );

  user$ = this.loginService.user$;

  activeModule$ = this.systemPreferencesService.activeModules$.pipe(
    map(modules => modules[0]),
  );

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit(): void {
  }

}
