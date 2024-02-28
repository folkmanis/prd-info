import { JobProduct } from 'src/app/jobs';
import { COLORS, ColorTotals, Colors, Kaste, Veikals } from '../interfaces';


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

export const jobProductsToColorTotals = (products: JobProduct[]): Record<Colors, number> => {
    const totals: Record<Colors, number> =
        COLORS
            .reduce((acc, curr) => (acc[curr] = 0, acc), {} as Record<Colors, number>);

    products.forEach(product => {
        if (COLORS.includes(product.name as Colors)) {
            totals[product.name] += product.count;
        }
    });

    return totals;

};
