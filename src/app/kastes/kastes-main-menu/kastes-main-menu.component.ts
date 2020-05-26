import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]='modules$'></app-card-menu>`,
})
export class KastesMainMenuComponent {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  modules$ = this.systemPreferencesService.childMenu('kastes');

}
