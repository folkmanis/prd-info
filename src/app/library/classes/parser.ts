export class Parser {

    parseCsv(csv: string, delimiter: string): (string | number)[][] {
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
