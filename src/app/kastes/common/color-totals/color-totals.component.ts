import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorTotals } from 'src/app/kastes/interfaces';
import { getKastesPreferences } from '../../services/kastes-preferences.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-totals',
  standalone: true,
  templateUrl: './color-totals.component.html',
  styleUrls: ['./color-totals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class ColorTotalsComponent {

  colors$ = getKastesPreferences('colors');

  @Input() colorTotals: ColorTotals[] = [];


}
