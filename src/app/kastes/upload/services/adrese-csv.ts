
type Adrese = Array<string | number>;

export class AdresesCsv {

    constructor(adr: Adrese[]) {
        this._adreses = adr;
    }

    private _adreses: Adrese[];

    get value(): Adrese[] {
        return this._adreses;
    }

    get colNames(): string[] {
        return Object.keys(this.value[0] || []);
    }

    /**
     * Izdzēš slejas, kuras norādītas masīvā
     *
     * @param colMap Dzēšamās slejas norādītas ar true
     */
    deleteColumns(colMap: boolean[]) {
        this._adreses = this.value.map(row =>
            row.filter((_, idx) => !colMap[idx])
        );
    }
    /**
     * Apvieno norādītās slejas
     *
     * @param colMap Apvienojamās slejas norādītas ar true
     */
    joinColumns(colMap: boolean[]) {
        const tmpAdr = [];
        this._adreses.forEach((row, idx) => {
            const nrow: any = [];
            let first: string;
            for (const k in row) { // k - indekss
                if (!colMap[k]) {
                    nrow[k] = row[k];
                } else {
                    if (first === undefined) {
                        first = k;
                        nrow[first] = row[k];
                    } else {
                        if (+row[first] === row[first] && +row[k] === row[k]) {
                            nrow[first] += row[k];
                        } else {
                            nrow[first] += ' ' + row[k];
                        }
                    }
                }
            }
            tmpAdr.push(nrow);
        });
        this._adreses = tmpAdr;
    }

    addColumn() {
        this._adreses = this.value.map(row => [...row, 0]);
    }

}
