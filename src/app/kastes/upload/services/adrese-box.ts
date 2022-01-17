import { VeikalsUpload, Kaste, Colors, ColorTotals, COLORS } from 'src/app/kastes/interfaces';
import { ColumnNames } from './chips.service';

export const MAX_PAKAS = 5;

export interface AdrBoxTotals {
    adreses: number;
    boxes: number;
    apjomi: number[];
}

export interface Totals {
    adrCount: number;
    boxCount: number;
    colorTotals: ColorTotals[];
}

export interface AdresesBoxPreferences {
    toPakas?: boolean;
    mergeAddress?: boolean;
}

/**
 * Adrese ar sūtījumu skaitu, bez pakojuma pa kastēm
 * Tiek izmantots kā pagaidu objekts pirms dalīšanas
 * pa kastēm
 */
class AdreseSkaits implements Record<ColumnNames, string | number> {
    kods: number;
    adrese: string;
    yellow: number = 0;
    rose: number = 0;
    white: number = 0;
    /**
     * No rindas masīva atstāj tikai vajadzīgos elementus,
     * un piešķir tos attiecīgajiem objekta locekļiem
     *
     * @param adrS string masīvs ar sākotnējām adreses rindām
     * @param colMap Map objekts
     * key - esošās slejas nosaukums
     * value - piešķirtais slejas pielietojums.
     */
    constructor(adrS: any[], colMap: Map<ColumnNames, string>, convertToPakas: boolean) {
        this.kods = +adrS[colMap.get('kods')];
        this.adrese = adrS[colMap.get('adrese')];
        this.addColors(adrS, colMap, convertToPakas);
    }

    totalPakas(): number {
        return COLORS.reduce((acc, key) => acc += this[key], 0);
    }

    addColors(adrS: any[], colMap: Map<ColumnNames, string>, convertToPakas: boolean) {
        for (const color of COLORS) {
            let count = +adrS[colMap.get(color)];
            if (!count || isNaN(count)) {
                continue;
            }
            if (convertToPakas && count >= 500) {
                count /= 500;
            }
            this[color] += count;
        }
    }

}

class Box implements Record<Colors, number> {

    yellow = 0;
    rose = 0;
    white = 0;

    store(j: Colors) {
        this[j]++;
    }

    sum(): number {
        return COLORS.reduce((total, val) => total += this[val], 0);
    }

    full(): boolean {
        return (this.sum() >= MAX_PAKAS);
    }

}

/**
 * Objekts katrai adresei. Satur pakojumu pa kastēm
 */
class AdreseBoxes {

    kods: number;
    adrese: string;
    boxes: Box[] = [];

    constructor(adr: AdreseSkaits) {
        ({ kods: this.kods, adrese: this.adrese } = adr);
        this.setBoxes(adr);
        this.optimize();
    }

    get totals(): Totals {
        const colorTotals: ColorTotals[] = COLORS.map(color => ({
            color,
            total: this.boxes.reduce((acc, curr) => acc + curr[color], 0)
        }));

        return {
            adrCount: 1,
            boxCount: this.boxes.length,
            colorTotals,
        };
    }

    toVeikalsUpload(pasutijums: number): VeikalsUpload {
        const data: VeikalsUpload = {
            kods: this.kods,
            adrese: this.adrese,
            pasutijums,
            kastes: this.boxes.map(bx => ({
                ...bx, total: bx.sum(), gatavs: false, uzlime: false
            }))
        };
        return data;
    }

    private setBoxes(adr: AdreseSkaits) {
        let box = new Box();
        for (const key of COLORS) {
            for (let m = 0; m < adr[key]; m++) {
                if (box.full()) {
                    this.boxes.push(box);
                    box = new Box();
                }
                box.store(key);
            }
        }
        this.boxes.push(box);
    }

    private optimize() {
        if (this.boxes.length < 2) { return; }  // Nevar optimizēt vienu kasti
        const last = this.boxes.length - 1;
        const lastBox = this.boxes[last];
        if (lastBox.sum() === 1 || lastBox.sum() === 3) { // 5-1 vai 5-3 kombinācija uz 4-2 vai 4-4
            this.moveOne(last - 1, last); // pārvieto vienu no priekšpēdējās uz pēdējo
            return;
        }
        if (this.boxes.length >= 3 && lastBox.sum() === 2) { // 5-5-2 uz 4-4-4
            this.moveOne(last - 2, last);
            this.moveOne(last - 1, last);
            return;
        }
    }

    private moveOne(from: number, to: number) {
        for (const key of Object.keys(this.boxes[from])) {
            if (this.boxes[from][key] > 0) {
                this.boxes[from][key]--; // Noņem
                this.boxes[to][key]++; // Pieliek
                break; // Tikai vienu paciņu
            }
        }
    }

}

/**
 * Satur sarakstu ar visām adresēm, ar sadalījumu pa pakojuma kastēm
 */
export class AdresesBoxes {

    data: AdreseBoxes[] = [];

    get totals(): Totals {
        return this.calculateTotals();
    }

    get apjomi(): number[] {
        const apj: number[] = [];
        for (const adrB of this.data) {
            for (const box of adrB.boxes) {
                if (!apj[box.sum()]) { apj[box.sum()] = 0; }
                apj[box.sum()]++;
            }
        }
        return apj;
    }


    constructor(
        adresesCsv: Array<string | number>[],
        chipsAssignement: [string, ColumnNames][],
        { toPakas, mergeAddress }: AdresesBoxPreferences = {},
    ) {
        const adreses = new Map<number | symbol, AdreseSkaits>();
        const colMap = new Map(chipsAssignement.map(([column, chip]) => [chip, column]));

        for (const adrS of adresesCsv) {

            const kods = +adrS[colMap.get('kods')];

            if (!kods || isNaN(kods)) {
                continue;
            }

            if (mergeAddress && adreses.has(kods)) {
                adreses.get(kods).addColors(adrS, colMap, toPakas);
                continue;
            }

            const adrM = new AdreseSkaits(adrS, colMap, toPakas);
            if (adrM.totalPakas() < 1) {
                continue; // Tukšs ieraksts
            }
            adreses.set(mergeAddress ? kods : Symbol(), adrM);

        }

        this.data = [...adreses.values()].map(adrese => new AdreseBoxes(adrese));

    }

    private calculateTotals(): Totals {
        const colorTotals: ColorTotals[] = COLORS.map(color => ({
            color,
            total: this.data.reduce((acc, { totals }) => acc + totals.colorTotals.find(({ color: c }) => c === color).total, 0)
        }));
        const boxCount = this.data.reduce((acc, adrBox) => acc + adrBox.totals.boxCount, 0);
        return {
            adrCount: this.data.length,
            boxCount,
            colorTotals,
        };
    }

    uploadRows(pasutijums: number): VeikalsUpload[] {
        return this.data.map(veikals => veikals.toVeikalsUpload(pasutijums));
    }

}
