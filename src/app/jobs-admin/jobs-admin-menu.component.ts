import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-jobs-admin-menu',
  template: `<app-card-menu [modules]="modules()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardMenuComponent],
})
export class JobsAdminMenuComponent {
  modules = inject(SystemPreferencesService).childMenu;
}
