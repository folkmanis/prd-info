import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService, SystemPreferencesService } from 'src/app/services';
import { User, AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() sideMenuToggle = new EventEmitter<void>();

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    @Inject(APP_PARAMS) private params: AppParams,
    ) { }

  // Aktīvā moduļa nosaukums, ko rādīt toolbārā
  activeModule$ = this.systemPreferencesService.activeModule$;
  // Lietotājs no servisa (lai būtu redzams templatē)
  user$: Observable<User> = this.loginService.user$;
  // Lietotāja menu
  userMenu$: Observable<{ route: string[], text: string; }[]> = this.loginService.user$.pipe(
    map(usr => usr ? [{ route: ['/login'], text: 'Atslēgties' }] : [])
  );
  version = this.params.version.appBuild;

  ngOnInit(): void {
  }

}
