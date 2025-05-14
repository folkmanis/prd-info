import { Colors } from 'src/app/interfaces';

export interface ColorTotals {
  color: Colors;
  total: number;
}

export interface Totals {
  total: number;
  kastes: number;
  labels: number;
  colorTotals: ColorTotals[];
}
