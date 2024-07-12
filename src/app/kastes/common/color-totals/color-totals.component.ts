import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { COLORS, Colors } from 'src/app/kastes/interfaces';
import { kastesPreferences } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-color-totals',
  standalone: true,
  templateUrl: './color-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe],
})
export class ColorTotalsComponent {
  colors = COLORS;

  colorStyles = kastesPreferences('colors');

  colorTotals = input.required<Record<Colors, number> | null>();
}
