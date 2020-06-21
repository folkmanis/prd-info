import { Observable, of, merge, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';
import { ParserService } from 'src/app/library';

interface CsvRecord extends Array<any> { }

export class AdresesCsv extends DataSource<CsvRecord> {

    constructor(private parserService: ParserService) {
        super();
    }

    private adreses$: BehaviorSubject<Array<any[]>> = new BehaviorSubject([]);

    connect(): Observable<CsvRecord[]> {
        return this.adreses$;
    }
    disconnect() { }
    get data(): BehaviorSubject<Array<any[]>> {
        return this.adreses$;
    }

    get value(): Array<any[]> {
        return this.adreses$.value;
    }
    /**
     * setCsv - Apstrādā un saglabā csv datus
     * @param csv csv fails kā string
     * @param delimiter atdalītāja simbols
     */
    setCsv(csv: string, delimiter: string = ',') {
        this.adreses$.next(this.parserService.parseCsv(csv, delimiter));
    }

    setJson(data: any[][]) {
        this.adreses$.next(this.normalizeTable(data));
    }

    get colNames(): string[] {
        return Object.keys(this.adreses$.value[0]);
    }

    /**
     * Izdzēš slejas, kuras norādītas masīvā
     * @param colMap Dzēšamās slejas norādītas ar true
     */
    deleteColumns(colMap: []) {
        const tmpData = this.adreses$.value.map(row =>
            row.filter((_, idx) => !colMap[idx])
        );
        this.adreses$.next(tmpData);
    }
    /**
     * Apvieno norādītās slejas
     * @param colMap Apvienojamās slejas norādītas ar true
     */
    joinColumns(colMap: []) {
        const tmpData = [];
        this.adreses$.value.forEach((row, idx) => {
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
            tmpData.push(nrow);
        });
        this.adreses$.next(tmpData);
    }

    deleteRows(rowMap: Array<any[]>) {
        const tmp = this.adreses$.value.filter((val, idx) => !rowMap.includes(val));
        this.adreses$.next(tmp);
    }

    private normalizeTable(data: any[][]): any[][] {
        const width = data.reduce((acc, row) => row.length > acc ? row.length : acc, 0);
        const ndata = data.map(row => {
            const nrow = new Array(width);
            for (let idx = 0; idx < width; idx++) {
                nrow[idx] = row[idx] || '';
            }
            return nrow;
        });
        return ndata;
    }

}
