import { UploadRow } from './upload-row';
import { Kaste, Colors, ColorTotals, COLORS } from 'src/app/interfaces';

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

/**
 * Adrese ar sūtījumu skaitu, bez pakojuma pa kastēm
 * Tiek izmantots kā pagaidu objekts pirms dalīšanas
 * pa kastēm
 */
class AdreseSkaits {
    kods: number;
    adrese: string;
    yellow: number;
    rose: number;
    white: number;
    /**
     * No rindas masīva atstāj tikai vajadzīgos elementus,
     * un piešķir tos attiecīgajiem objekta locekļiem
     *
     * @param adrS string masīvs ar sākotnējām adreses rindām
     * @param colMap Map objekts
     * key - esošās slejas nosaukums
     * value - piešķirtais slejas pielietojums.
     */
    constructor(adrS: any[], colMap: Map<string, string>, convertToPakas: boolean) {
        adrS.forEach((val, idx) => {
            const m = colMap.get(idx.toString());
            if (m) { this[m] = val; }
        });
        COLORS.forEach(key => this[key] = (+this[key] || 0));
        if (convertToPakas) {
            COLORS.forEach(key => this[key] /= this[key] >= 500 ? 500 : 1);
        }
    }

    totalPakas(): number {
        return COLORS.reduce((acc, key) => acc += this[key], 0);
    }

}

export class Box implements Record<Colors, number> {
    yellow = 0; rose = 0; white = 0;

    constructor({ yellow = 0, rose = 0, white = 0 } = {}) {
        this.yellow = yellow; this.rose = rose; this.white = white;
    }

    store(j: Colors) {
        this[j]++;
    }
    sum(): number {
        return COLORS.reduce((total, val) => total += this[val], 0);
    }
    full(): boolean {
        return (this.sum() >= MAX_PAKAS);
    }
    [Symbol.iterator] = function*() {
        yield this.yellow;
        yield this.rose;
        yield this.white;
    };
}

/**
 * Objekts katrai adresei. Satur pakojumu pa kastēm
 */
export class AdreseBox {
    total: number;
    kods: number; adrese: string;
    box: Box[] = [];
    /**
     * Kontruktors izveido pakojumu pa kastēm
     *
     * @param adr Objekts ar adreses pasūtījumu
     */
    constructor(adr: AdreseSkaits) {
        ({ kods: this.kods, adrese: this.adrese } = adr);
        let box = new Box();
        for (const key of COLORS) {
            for (let m = 0; m < adr[key]; m++) {
                if (box.full()) {
                    this.box.push(box);
                    box = new Box();
                }
                box.store(key);
            }
        }
        this.box.push(box);
        this.optimize();
    }
    /**
     * Uzlabo sadalījumu pa kastēm
     */
    optimize() {
        if (this.box.length < 2) { return; }  // Nevar optimizēt vienu kasti
        const last = this.box.length - 1;
        const lastBox = this.box[last];
        if (lastBox.sum() === 1 || lastBox.sum() === 3) { // 5-1 vai 5-3 kombinācija uz 4-2 vai 4-4
            this.moveOne(last - 1, last); // pārvieto vienu no priekšpēdējās uz pēdējo
            return;
        }
        if (this.box.length >= 3 && lastBox.sum() === 2) { // 5-5-2 uz 4-4-4
            this.moveOne(last - 2, last);
            this.moveOne(last - 1, last);
            return;
        }
    }
    /**
     * Pārvieto vienu paku (pirmo pēc kārtas) no vienas kastes uz otru
     * Nepieciešams optimizācijas aktivitātei
     *
     * @param from kastes indekss 'no'
     * @param to kastes indekss 'uz'
     */
    private moveOne(from: number, to: number) {
        for (const key of Object.keys(this.box[from])) {
            if (this.box[from][key] > 0) {
                this.box[from][key]--; // Noņem
                this.box[to][key]++; // Pieliek
                break; // Tikai vienu paciņu
            }
        }
    }
    /**
     * Kopējais apjoms uz adresi
     */
    sum(): number {
        return this.box.reduce((total, val) => total += val.sum(), 0);
    }

    get totals(): Totals {
        const colorTotals: ColorTotals[] = COLORS.map(color => ({
            color,
            total: this.box.reduce((acc, curr) => acc + curr[color], 0)
        }));

        return {
            adrCount: 1,
            boxCount: this.box.length,
            colorTotals,
        };
    }
    /**
     * No pakojuma uz tabulas ierakstu
     */
    reduce(pasutijums: number): UploadRow {
        const data: UploadRow = {
            kods: this.kods,
            adrese: this.adrese,
            pasutijums,
            kastes: this.box.map(bx => (
                { ...bx, total: bx.sum(), gatavs: false, uzlime: false })
            )
        };
        return data;
    }
}

/**
 * Satur sarakstu ar visām adresēm, ar sadalījumu pa pakojuma kastēm
 */
export class AdresesBox {
    private _data: AdreseBox[];
    get data(): AdreseBox[] {
        return this._data;
    }

    private _totals: Totals | undefined;
    get totals(): Totals {
        return this._totals;
    }

    constructor(
        adresesCsv: Array<string | number>[],
        colMap: Map<string, string>,
        toPakas = false,
    ) {
        this._data = [];
        for (const adrS of adresesCsv) {
            const adrM = new AdreseSkaits(adrS, colMap, toPakas);
            if (adrM.totalPakas() < 1) {
                continue; // Tukšs ieraksts
            }
            this._data.push(new AdreseBox(adrM));
        }
        this._totals = this.calculateTotals();
    }

    private calculateTotals(): Totals {
        const colorTotals: ColorTotals[] = COLORS.map(color => ({
            color,
            total: this.data.reduce((acc, { totals }) => acc + totals.colorTotals.find(({ color: c }) => c === color).total, 0)
        }));
        const boxCount = this.data.reduce((acc, adrBox) => acc + adrBox.totals.boxCount, 0);
        return {
            adrCount: this._data.length,
            boxCount,
            colorTotals,
        };
    }

    uploadRows(pasutijums: number): UploadRow[] {
        return this.data.map(veikals => veikals.reduce(pasutijums));
    }

    get apjomi(): number[] {
        const apj: number[] = [];
        for (const adrB of this._data) {
            for (const box of adrB.box) {
                if (!apj[box.sum()]) { apj[box.sum()] = 0; }
                apj[box.sum()]++;
            }
        }
        return apj;
    }

}
