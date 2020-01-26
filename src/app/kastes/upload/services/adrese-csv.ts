export class AdresesCsv extends Array {

    /**
     * setCsv - Apstrādā un saglabā csv datus
     * @param csv csv fails kā string
     * @param delimiter atdalītāja simbols
     */
    public setCsv(csv: string, delimiter: string = ',') {
        this.parse(csv, delimiter);
    }

    public get colNames(): string[] {
        return Object.keys(this[0]);
    }

    /**
     * Izdzēš slejas, kuras norādītas masīvā
     * @param colMap Dzēšamās slejas norādītas ar true
     */
    deleteColumns(colMap: {}) {
        this.forEach(
            (row, idx) => {
                const nrow: any = [];
                for (const k in row) {
                    if (!colMap[k]) { nrow[k] = row[k]; }
                }
                this[idx] = nrow;
            }
        );
    }

    joinColumns(colMap: {}) {
        this.forEach((row, idx) => {
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
            this[idx] = nrow;
        });
    }

    private parse(csv: string, delimiter: string) {
        const lines = csv.split('\n');

        for (const row of lines) { // (let i = 0; i < lines.length; i++) {
            const obj = [];

            let queryIdx = 0;
            let startValueIdx = 0;
            let idx = 0;

            if (row.trim() === '') { continue; }

            while (idx < row.length) {
                /* if we meet a double quote we skip until the next one */
                let c = row[idx];
                let isNumber = true;

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

                    queryIdx++;
                    if (isNumber && !isNaN(+value)) { // && i
                        // obj[queryIdx] = +value;
                        obj.push(+value);
                    } else {
                        // obj[queryIdx] = value;
                        obj.push(value);
                    }
                    startValueIdx = idx + 1;
                }
                ++idx;
            }
            this.push(obj);
        }
    }
}
