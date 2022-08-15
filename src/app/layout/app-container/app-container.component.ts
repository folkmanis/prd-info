import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { LoginService } from 'src/app/login';
import { SystemPreferencesService } from 'src/app/services';
import { LayoutService } from 'src/app/library';


@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent {

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


}
