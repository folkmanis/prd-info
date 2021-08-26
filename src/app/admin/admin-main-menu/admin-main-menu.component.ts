import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-admin-main-menu',
  template: `<app-card-menu [modules]="modules$ | async"></app-card-menu>`,
})
export class AdminMainMenuComponent {

  modules$ = this.systemPreferencesService.childMenu$;

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

}
