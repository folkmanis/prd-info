import { Component } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    ) { }
  modules$ = this.systemPreferencesService.childMenu('jobs');

}
