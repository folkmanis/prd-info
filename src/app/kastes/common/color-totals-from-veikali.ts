import { COLORS, Colors, ColorTotals, Veikals, VeikalsBox } from 'src/app/interfaces';
import { VeikalsEditComponent } from '../edit/pakosanas-saraksts/veikals-edit/veikals-edit.component';
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

export function kastesTotalsFromVeikali(veikali: Veikals[]): [number, number][] {
    const tot = new Map<number, number>();
    const kastes: VeikalsBox[] = [].concat(...veikali.map(veik => veik.kastes));
    for (const k of kastes) {
        tot.set(k.total, (tot.get(k.total) || 0) + 1);
    }
    return [...tot.entries()].sort((a, b) => a[0] - b[0]);
}
