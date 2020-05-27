import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-admin-main-menu',
  template: `<app-card-menu [modules]="modules$"></app-card-menu>`,
})
export class AdminMainMenuComponent {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }
  modules$ = this.systemPreferencesService.childMenu$;

}
