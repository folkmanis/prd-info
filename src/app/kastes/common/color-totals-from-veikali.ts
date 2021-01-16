import { COLORS, Colors, ColorTotals, Veikals, VeikalsBox } from 'src/app/interfaces';
const COLORS_SORTED = [...COLORS].sort((a, b) => a.localeCompare(b));

export function colorTotalsFromVeikali(veikali: Veikals[]): ColorTotals[] {
    return colorTotalsFromVeikalsBoxs(
        [].concat(...veikali.map(veik => veik.kastes))
    );
}

export function colorTotalsFromVeikalsBoxs(kastes: VeikalsBox[]): ColorTotals[] {
    const tot = new Map<Colors, number>(COLORS_SORTED.map(col => [col, 0]));
    for (const k of kastes) {
        COLORS.forEach(c => tot.set(c, tot.get(c) + k[c]));
    }
    return [...tot.entries()].map(([color, total]) => ({ color, total }));
}
