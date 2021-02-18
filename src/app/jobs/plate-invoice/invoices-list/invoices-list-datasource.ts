import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InvoicesFilter, InvoiceTable } from 'src/app/interfaces';
import { InvoicesService } from '../services/invoices.service';

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
            );
        } else {
            return this.service.getInvoicesHttp({}).pipe(
            );
        }
    }

    disconnect(): void { }

}
