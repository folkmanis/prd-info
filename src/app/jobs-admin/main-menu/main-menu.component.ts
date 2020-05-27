import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  template: `<app-card-menu [modules]='modules$'></app-card-menu>`,
})
export class MainMenuComponent {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    ) { }
  modules$ = this.systemPreferencesService.childMenu$;

}
