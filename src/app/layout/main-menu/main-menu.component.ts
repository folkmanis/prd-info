import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SystemPreferencesService } from 'src/app/services';
import { CardMenuComponent } from '../../library/card-menu/card-menu.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  standalone: true,
  imports: [CardMenuComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  menuItems$ = inject(SystemPreferencesService).modules$;
}
