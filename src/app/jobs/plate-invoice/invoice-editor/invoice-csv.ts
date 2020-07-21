import { InvoiceLike, InvoiceProduct, Job, JobProduct, Product } from 'src/app/interfaces';
import * as moment from 'moment';

const DOCUMENT_FIELDS: string[] = [
    'InvoiceDate', // *
    'ClientName', // *
    'PaymentMethod', // 1
    'Comment', // *
];

const ITEM_FIELDS: string[] = [
    'ItemName', // *
    'ItemDescription', // *
    'ItemQty', // *
    'ItemPrice', // *
];

const REPORT_FIELDS: string[] = [
    'Datums', 'Klients', 'Numurs', 'Nosaukums', 'Veids', 'Skaits', 'Cena', 'Summa'
];

export class InvoiceCsv {
    constructor(
        private invoice: InvoiceLike,
        private separator = ',',
    ) { }

    toCsvInvoice(): string {
        if (!this.invoice.products) { return DOCUMENT_FIELDS.join(this.separator); }

        const head: string[] = [...DOCUMENT_FIELDS];
        this.invoice.products.forEach((_, idx) => ITEM_FIELDS.forEach(itm => head.push(itm + (idx + 1))), []);

        const data: string[] = [
            moment(this.invoice.createdDate).format('L'),
            this.invoice.financial.clientName,
            '1',
            this.invoice.comment || '',
        ];

        return stringify(
            [
                head,
                this.invoice.products.reduce((acc, curr) => [
                    ...acc,
                    curr._id,
                    curr.comment || '',
                    curr.count.toFixed(6),
                    curr.price.toFixed(6),
                ], data)
            ],
            this.separator);
    }

    toCsvReport(): string {
        const data: string[][] = [REPORT_FIELDS];
        this.invoice.jobs.forEach(job => {
            const pr = job.products instanceof Array ? undefined : job.products;
            data.push([
                moment(this.invoice.createdDate).format('L'),
                this.invoice.customer,
                job.jobId.toString(),
                job.name,
                pr.name,
                pr.count.toFixed(2).replace('.', ','),
                pr.price.toFixed(2).replace('.', ','),
                (pr.count * pr.price).toFixed(2).replace('.', ','),
            ]);
        });
        return stringify(data, this.separator);
    }
}

const wrapField: (r: string) => string = (r) => '"' + r + '"';

function stringify(r: string[][], separator: string): string {
    return r.map(row => row.map(wrapField).join(separator)).join('\n');
}
