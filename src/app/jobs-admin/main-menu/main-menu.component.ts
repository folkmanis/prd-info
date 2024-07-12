import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardMenuComponent } from 'src/app/library/card-menu/card-menu.component';
import { SystemPreferencesService } from 'src/app/services';

@Component({
  template: `<app-card-menu [modules]="modules$ | async"></app-card-menu>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardMenuComponent],
})
export class MainMenuComponent {
  modules$ = inject(SystemPreferencesService).childMenu$;
}
