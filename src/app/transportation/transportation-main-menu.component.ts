import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-transportation-main-menu',
  standalone: true,
  imports: [CardMenuComponent],
  template: `<app-card-menu [modules]="modules()" />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationMainMenuComponent {
  modules = inject(SystemPreferencesService).childMenu;
}
