import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorTotals, Colors } from 'src/app/kastes/interfaces';

interface TotalColorNames {
  name: string;
  code: string;
  count: number;
}

type ColorCodes = {
  [key in Colors]: string;
};

const DEFAULT_COLORS: ColorCodes = {
  yellow: null,
  rose: null,
  white: null,
};

@Component({
  selector: 'app-colors-output',
  templateUrl: './colors-output.component.html',
  styleUrls: ['./colors-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ColorsOutputComponent {
  @Input({ required: true }) colorTotals: ColorTotals[] = [];

  @Input({ required: true }) colorCodes: ColorCodes = { ...DEFAULT_COLORS };

  totalColorNames(): TotalColorNames[] {
    return this.colorTotals.map((tot) => ({
      name: tot.color,
      count: tot.total,
      code: this.colorCodes[tot.color],
    }));
  }
}
