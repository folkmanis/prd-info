import { DataSource } from '@angular/cdk/table';
import { Invoice, InvoicesFilter } from 'src/app/interfaces';
import { InvoicesService } from '../../services';
import { Observable } from 'rxjs';
import { switchMap, share, map } from 'rxjs/operators';
import * as moment from 'moment';

moment.locale('lv');

export type InvoiceTable = Invoice & {
    countAll: number,
    totalAll: number,
    createdDateString: string,
};

export class InvoicesListDatasource extends DataSource<InvoiceTable> {

    constructor(
        private service: InvoicesService
    ) {
        super();
    }
    filter$: Observable<InvoicesFilter> | undefined;

    connect(): Observable<InvoiceTable[]> {
        if (this.filter$) {
            return this.filter$.pipe(
                switchMap(f => this.service.getInvoicesHttp(f)),
                map(this.calcTotals),
                share(),
            );
        } else {
            return this.service.getInvoicesHttp({}).pipe(
                map(this.calcTotals)
            );
        }
    }

    disconnect(): void { }

    private calcTotals(invoices: Invoice[]): InvoiceTable[] {
        return invoices.map(invoice => ({
            ...invoice,
            ...invoice.products.reduce((acc, curr) => ({
                countAll: acc.countAll + curr.count, totalAll: acc.totalAll + curr.total
            }), { countAll: 0, totalAll: 0 }),
            createdDateString: moment(invoice.createdDate).format('L'),
        }));
    }
}
