import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorTotals } from 'src/app/kastes/interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';

@Component({
  selector: 'app-color-totals',
  templateUrl: './color-totals.component.html',
  styleUrls: ['./color-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorTotalsComponent {

  colors$ = getKastesPreferences('colors');

  @Input() colorTotals: ColorTotals[] = [];


}
