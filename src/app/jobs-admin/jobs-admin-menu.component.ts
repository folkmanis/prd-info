import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { LayoutService } from '../layout/layout.service';

@Component({
  selector: 'app-jobs-admin-menu',
  template: `<app-card-menu [modules]="modules()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardMenuComponent],
})
export class JobsAdminMenuComponent {
  modules = inject(LayoutService).childMenu;
}
