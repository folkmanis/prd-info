import { COLORS, Colors, ColorTotals, Veikals, VeikalsKaste, Kaste } from '../interfaces';
import { JobProduct } from 'src/app/jobs';


export const colorTotalsFromVeikali = (veikali: Veikals[]): ColorTotals[] =>
    colorTotalsFromVeikalsBoxs(
        [].concat(...veikali.map(veik => veik.kastes))
    );

export const colorTotalsFromVeikalsBoxs = (kastes: Kaste[]): ColorTotals[] => {
    const tot = new Map<Colors, number>(COLORS.map(col => [col, 0]));
    for (const k of kastes) {
        COLORS.forEach(c => tot.set(c, tot.get(c) + k[c]));
    }
    return [...tot.entries()].map(([color, total]) => ({ color, total }));
};

export const kastesTotalsFromVeikali = (veikali: Veikals[]): [number, number][] => {
    const tot = new Map<number, number>();
    const kastes: Kaste[] = [].concat(...veikali.map(veik => veik.kastes));
    for (const k of kastes) {
        tot.set(k.total, (tot.get(k.total) || 0) + 1);
    }
    return [...tot.entries()].sort((a, b) => a[0] - b[0]);
};

export const sortColorTotals = (totals: ColorTotals[]): ColorTotals[] => {
    const totMap = new Map<Colors, number>(COLORS.map(color => [color, 0]));
    totals.forEach(total => totMap.set(total.color, total.total));
    return [...totMap.entries()].map(([color, total]) => ({ color, total }));
};

export const jobProductsToColorTotals = (products: JobProduct[]): ColorTotals[] => {
    const tot = new Map<string, number>(COLORS.map(col => [col, 0]));
    for (const prod of products) {
        const count = tot.get(prod.name);
        if (count === undefined) {
            continue;
        }
        tot.set(prod.name, count + prod.count);
    }
    return [...tot.entries()].map(([color, total]) => ({ color, total: total * 2 })) as ColorTotals[];
};
