import { COLORS, Colors, ColorTotals, Veikals, VeikalsBox } from 'src/app/interfaces';

export function colorTotalsFromVeikali(veikali: Veikals[]): ColorTotals[] {
    return colorTotalsFromVeikalsBoxs(
        [].concat(...veikali.map(veik => veik.kastes))
    );
}

export function colorTotalsFromVeikalsBoxs(kastes: VeikalsBox[]): ColorTotals[] {
    const tot = new Map<Colors, number>(COLORS.map(col => [col, 0]));
    for (const k of kastes) {
        COLORS.forEach(c => tot.set(c, tot.get(c) + k[c]));
    }
    return [...tot.entries()].map(([color, total]) => ({ color, total }));
}

export function kastesTotalsFromVeikali(veikali: Veikals[]): [number, number][] {
    const tot = new Map<number, number>();
    const kastes: VeikalsBox[] = [].concat(...veikali.map(veik => veik.kastes));
    for (const k of kastes) {
        tot.set(k.total, (tot.get(k.total) || 0) + 1);
    }
    return [...tot.entries()].sort((a, b) => a[0] - b[0]);
}

export function sortColorTotals(totals: ColorTotals[]): ColorTotals[] {
    const totMap = new Map<Colors, number>(COLORS.map(color => [color, 0]));
    totals.forEach(total => totMap.set(total.color, total.total));
    return [...totMap.entries()].map(([color, total]) => ({ color, total }));
}