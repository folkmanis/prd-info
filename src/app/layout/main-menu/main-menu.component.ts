import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from '../../library/card-menu/card-menu.component';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-main-menu',
  template: `<app-card-menu [modules]="menuItems()" />`,
  imports: [CardMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  menuItems = inject(LayoutService).modules;
}
