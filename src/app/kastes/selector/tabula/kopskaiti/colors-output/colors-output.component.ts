import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Colors, ColorTotals } from 'src/app/interfaces';

interface TotalColorNames {
  name: string;
  code: string;
  count: number;
}

type ColorCodes = {
  [key in Colors]: string;
};

const DEFAULT_COLORS: ColorCodes = {
  yellow: null, rose: null, white: null
};

@Component({
  selector: 'app-colors-output',
  templateUrl: './colors-output.component.html',
  styleUrls: ['./colors-output.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsOutputComponent {
  /** Skaiti pa krāsām */
  @Input()
  get colorTotals(): ColorTotals[] { return this._colorTotals; }
  set colorTotals(colorTotals: ColorTotals[]) {
    this._colorTotals = colorTotals || [];
    this.reCalculateTotals();
  }
  private _colorTotals: ColorTotals[] = [];

  /** Krāsu ekrāna kodi */
  @Input() get colorCodes(): ColorCodes { return this._colorCodes; }
  set colorCodes(colorCodes: ColorCodes) {
    this._colorCodes = colorCodes || { ...DEFAULT_COLORS };
    this.reCalculateTotals();
  }
  private _colorCodes: ColorCodes = { ...DEFAULT_COLORS };

  constructor(
  ) { }

  totalColorNames: TotalColorNames[] = [];

  reCalculateTotals(): void {
    this.totalColorNames = this.colorTotals.map(tot => ({
      name: tot.color,
      count: tot.total,
      code: this.colorCodes[tot.color],
    }));
  }

}
