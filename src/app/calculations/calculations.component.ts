import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from '../library/card-menu/card-menu.component';
import { SystemPreferencesService } from '../services/system-preferences.service';

@Component({
  selector: 'app-calculations',
  template: `<app-card-menu [modules]="modules$ | async"></app-card-menu>`,
  standalone: true,
  imports: [CardMenuComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationsComponent {
  modules$ = inject(SystemPreferencesService).childMenu$;
}
