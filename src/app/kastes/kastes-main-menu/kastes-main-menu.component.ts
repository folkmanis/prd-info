import { Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]="modules()" />`,
  standalone: true,
  imports: [CardMenuComponent],
})
export class KastesMainMenuComponent {
  modules = inject(SystemPreferencesService).childMenu;
}
