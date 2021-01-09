import { ColorTotals, Veikals } from 'src/app/interfaces';

export type VeikalsWithTotals = Veikals & { totals: ColorTotals[]; };
