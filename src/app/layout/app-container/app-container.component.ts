import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { LoginService } from 'src/app/login';
import { SystemPreferencesService } from 'src/app/services';


@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainerComponent {



  user$ = this.loginService.user$;

  activeModule$ = this.systemPreferencesService.activeModules$.pipe(
    map(modules => modules[0]),
  );

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
  ) { }


}
