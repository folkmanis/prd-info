import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SystemPreferencesService } from '../services/system-preferences.service';
import { CardMenuComponent } from '../library/card-menu/card-menu.component';

@Component({
  standalone: true,
  template: `<app-card-menu [modules]="modules()"></app-card-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardMenuComponent],
})
export class JobsComponent {
  modules = inject(SystemPreferencesService).childMenu;
}
