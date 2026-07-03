import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LayoutService } from '../layout/layout.service';
import { CardMenuComponent } from '../library/card-menu/card-menu.component';

@Component({
  template: `<app-card-menu [modules]="modules()"></app-card-menu>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardMenuComponent],
})
export class JobsComponent {
  modules = inject(LayoutService).childMenu;
}
