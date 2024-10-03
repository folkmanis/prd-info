import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';
import { CardMenuComponent } from '../../library/card-menu/card-menu.component';

@Component({
  selector: 'app-main-menu',
  template: `<app-card-menu [modules]="menuItems()" />`,
  standalone: true,
  imports: [CardMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  menuItems = inject(SystemPreferencesService).modules;
}
