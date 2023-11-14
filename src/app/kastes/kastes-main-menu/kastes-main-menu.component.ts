import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]="modules$ | async"></app-card-menu>`,
  standalone: true,
  imports: [AsyncPipe, CardMenuComponent],
})
export class KastesMainMenuComponent {
  constructor(private systemPreferencesService: SystemPreferencesService) {}

  modules$ = this.systemPreferencesService.childMenu$;
}
