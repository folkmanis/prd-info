import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { InvoicesFilter, InvoiceTable } from 'src/app/interfaces';
import { InvoicesService } from '../../services/invoices.service';

export class InvoicesListDatasource implements DataSource<InvoiceTable> {

    filter$: Observable<InvoicesFilter> | undefined;

    constructor(
        private service: InvoicesService
    ) { }

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
