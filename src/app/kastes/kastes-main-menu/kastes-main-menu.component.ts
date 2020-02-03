import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]="modules$"></app-card-menu>`,
})
export class KastesMainMenuComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  modules$ = this.loginService.modules$.pipe(
    map(mod => mod.find(md => md.value === 'kastes').childMenu || []),
  );
  ngOnInit() {
  }

}
