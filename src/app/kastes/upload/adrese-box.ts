import { UploadRow } from './upload-row';
import { AdresesCsv } from './adrese-csv';
import { Observable, of } from 'rxjs';

export const MaxPakas = 5;

export interface AdrBoxTotals {
    adreses: number;
    boxes: number;
    apjomi: number[];
}

export interface Totals {
    adrCount: number;
    boxCount: number;
    yellow: number;
    rose: number;
    white: number;
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
     * @param adrS string masīvs ar sākotnējām adreses rindām
     * @param colMap Map objekts
     * key - esošās slejas nosaukums
     * value - piešķirtais slejas pielietojums.
     */
    constructor(adrS: [], colMap: Map<number, string>) {
        adrS.forEach((val, idx) => {
            const m = colMap[idx];
            if (m) { this[m] = val; }
        });
    }

    skaitiToPakas(exec = true): AdreseSkaits {
        if (!exec) { return this; }  // parametrs, kas nosaka izpildi
        if (this.yellow >= 500) { this.yellow /= 500; }
        if (this.rose >= 500) { this.rose /= 500; }
        if (this.white >= 500) { this.white /= 500; }
        return this;
    }

}

export class Box {
    static Keys: string[] = ['yellow', 'rose', 'white'];
    yellow = 0; rose = 0; white = 0;

    constructor({ yellow = 0, rose = 0, white = 0 } = {}) {
        this.yellow = yellow; this.rose = rose; this.white = white;
    }

    store(j: string) {
        this[j]++;
    }
    sum(): number {
        return Box.Keys.reduce((total, val) => total += this[val], 0);
    }
    full(): boolean {
        return (this.sum() >= MaxPakas);
    }
    // tslint:disable-next-line: space-before-function-paren
    [Symbol.iterator] = function* () {
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
     * @param adr Objekts ar adreses pasūtījumu
     */
    constructor(adr: AdreseSkaits) {
        ({ kods: this.kods, adrese: this.adrese } = adr);
        let box = new Box();
        for (const key of Box.Keys) {
            for (let m = 0; m < adr[key]; m++) {
                if (box.full()) {
                    this.box.push(box);
                    box = new Box();
                }
                box.store(key);
            }
        }
        // this.total = this.sum();
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
        const init: Totals = {
            adrCount: 1,
            boxCount: this.box.length,
            yellow: 0,
            rose: 0,
            white: 0
        };
        return this.box.reduce((acc, curr) => {
            acc.yellow += curr.yellow; acc.rose += curr.rose; acc.white += curr.white;
            return acc;
        }, init);
    }
    /**
     * No pakojuma
     */
    reduce(): UploadRow[] {
        const data: UploadRow[] = [];
        for (const box of this.box) {
            data.push({ kods: this.kods, adrese: this.adrese, ...box });
        }
        return data;
    }
}

/**
 * Satur sarakstu ar visām adresēm, ar sadalījumu pa pakojuma kastēm
 */
export class AdresesBox {
    data: AdreseBox[] = [];

    constructor() { }

    init(
        adrSaraksts: AdresesCsv,
        colMap: Map<number, string>,
        { toPakas = false } = {}
    ): Observable<AdreseBox[]> {
        for (const adrS of adrSaraksts) {
            const adrM = (new AdreseSkaits(adrS, colMap)).skaitiToPakas(toPakas);
            if (Box.Keys.reduce<number>((total, key) => total += adrM[key], 0) < 1) {
                continue; // Tukšs ieraksts
            }
            this.data.push(new AdreseBox(adrM));
        }
        return of(this.data);
    }

    public get values(): AdreseBox[] {
        return this.data;
    }

    public get uploadRow(): UploadRow[] {
        const ur: UploadRow[] = [];
        for (const adr of this.data) {
            ur.push(...adr.reduce());
        }
        return ur;
    }

    get totals(): Totals {
        const init: Totals = {
            adrCount: this.data.length,
            boxCount: 0,
            yellow: 0,
            rose: 0,
            white: 0
        };
        return this.data.reduce((acc, curr) => {
            acc.boxCount += curr.totals.boxCount;
            acc.yellow += curr.totals.yellow;
            acc.rose += curr.totals.rose;
            acc.white += curr.totals.white;
            return acc;
        }, init);
    }

    get apjomi(): number[] {
        const apj: number[] = [];
        for (const adrB of this.data) {
            for (const box of adrB.box) {
                if (!apj[box.sum()]) { apj[box.sum()] = 0; }
                apj[box.sum()]++;
            }
        }
        return apj;
    }

}
