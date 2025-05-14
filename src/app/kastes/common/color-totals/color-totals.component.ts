import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Colors, COLORS } from 'src/app/interfaces';
import { kastesPreferences } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-color-totals',
  templateUrl: './color-totals.component.html',
  styleUrl: './color-totals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TitleCasePipe],
})
export class ColorTotalsComponent {
  colors = COLORS;

  colorStyles = kastesPreferences('colors');

  colorTotals = input.required<Record<Colors, number> | null>();
}
