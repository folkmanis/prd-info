import { Component, inject } from '@angular/core';
import { LayoutService } from 'src/app/layout/layout.service';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';

@Component({
  selector: 'app-kastes-main-menu',
  template: `<app-card-menu [modules]="modules()" />`,
  imports: [CardMenuComponent],
})
export class KastesMainMenuComponent {
  modules = inject(LayoutService).childMenu;
}
