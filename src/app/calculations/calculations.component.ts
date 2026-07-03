import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { CardMenuComponent } from '../library/card-menu/card-menu.component';

@Component({
  selector: 'app-calculations',
  template: `<app-card-menu [modules]="modules()"></app-card-menu>`,
  imports: [CardMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationsComponent {
  modules = inject(LayoutService).childMenu;
}
