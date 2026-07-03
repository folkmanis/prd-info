import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-transportation-main-menu',
  imports: [CardMenuComponent],
  template: `<app-card-menu [modules]="modules()" />`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationMainMenuComponent {
  modules = inject(LayoutService).childMenu;
}
