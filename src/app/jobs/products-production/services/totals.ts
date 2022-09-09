import { JobsProduction } from '../../interfaces';


export class Totals {
    sum = 0;
    count = 0;
    total = 0;

    add(prod: JobsProduction): Totals {
        this.sum += prod.sum;
        this.count += prod.count;
        this.total += prod.total;
        return this;
    }
}

