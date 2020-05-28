import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService, SystemPreferencesService } from 'src/app/services';
import { User } from 'src/app/interfaces';

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
  ) { }

  // Aktīvā moduļa nosaukums, ko rādīt toolbārā
  activeModule$ = this.systemPreferencesService.activeModule$;
  // Lietotājs no servisa (lai būtu redzams templatē)
  user$: Observable<User> = this.loginService.user$;
  // Lietotāja menu
  userMenu$: Observable<{ route: string[], text: string; }[]> = this.loginService.user$.pipe(
    map(usr => usr ? [{ route: ['/login'], text: 'Atslēgties' }] : [])
  );

  ngOnInit(): void {
  }

}
