import { Observable, of, merge, BehaviorSubject } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { DataSource } from '@angular/cdk/collections';

interface CsvRecord extends Array<any> { }

export class AdresesCsv extends DataSource<CsvRecord> {

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
        this.adreses$.next(this.parse(csv, delimiter));
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

    private parse(csv: string, delimiter: string): [][] {
        const lines = csv.split('\n');
        const data = [];

        for (const row of lines) { // (let i = 0; i < lines.length; i++) {
            const obj = [];

            let queryIdx = 0;
            let startValueIdx = 0;
            let idx = 0;

            if (row.trim() === '') { continue; }

            while (idx < row.length) {
                let c = row[idx];
                let isNumber = true;

                /* if we meet a double quote we skip until the next one */
                if (c === '"') {
                    do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1);
                }

                if (c === delimiter || /* handle end of line with no comma */ idx === row.length - 1) {
                    /* we've got a value */
                    let value = row.substr(startValueIdx, idx - startValueIdx).trim();

                    /* skip first double quote */
                    if (value[0] === '"') { value = value.substr(1); isNumber = false; }
                    /* skip last comma */
                    if (value[value.length - 1] === delimiter) { value = value.substr(0, value.length - 1); }
                    /* skip last double quote */
                    if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }

                    if (isNumber && !isNaN(+value)) { // && i
                        // obj[queryIdx.toString()] = +value;
                        obj.push(+value);
                    } else {
                        // obj[queryIdx] = value;
                        obj.push(value);
                    }
                    queryIdx++;
                    startValueIdx = idx + 1;
                }
                ++idx;
            }
            data.push(obj);
        }
        return data;
    }
}
