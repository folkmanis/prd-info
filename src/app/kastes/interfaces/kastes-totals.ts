import { Colors } from './kastes-colors';

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

