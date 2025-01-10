import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-preferences-card',
  templateUrl: './preferences-card.component.html',
  styleUrls: ['./preferences-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
})
export class PreferencesCardComponent {}
