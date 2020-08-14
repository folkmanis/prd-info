import { PdfMakeWrapper, Table, Columns, Txt, Cell } from 'pdfmake-wrapper';
import { InvoiceLike, InvoiceProduct, Job, JobProduct, Product } from 'src/app/interfaces';
import * as moment from 'moment';

export class InvoiceReport {
    private _pdf: PdfMakeWrapper = new PdfMakeWrapper();
    constructor(
        private _invoice: InvoiceLike,
        private _locale = 'lv',
    ) {
        moment.locale(this._locale);
        this._pdf.pageSize('A4');
        this._pdf.pageMargins([30, 30, 30, 30]);
        this._pdf.info({ title: `Report ${_invoice.invoiceId}` });
    }

    open(): void {
        const title = (this._invoice.financial?.clientName || this._invoice.customer) + (this._invoice.invoiceId ? ` / ${this._invoice.invoiceId}` : '');
        this._pdf.add(
            new Txt(title).fontSize(14).bold().end,
        );
        this._pdf.add(
            new Table([
                ...this.createProductsTable(this._invoice.products),
                [
                    '',
                    '',
                    new Cell(new Txt('Kopā').bold().alignment('right').end).end,
                    new Cell(new Txt(`${this._invoice.total.toFixed(2)} EUR`).bold().end).alignment('right').end,
                ]
            ])
                .layout('lightHorizontalLines')
                .fontSize(10)
                .headerRows(1)
                .end
        );
        this._pdf.add(
            new Table(this.createJobsTable(this._invoice.jobs))
                .layout('lightHorizontalLines')
                .fontSize(8)
                .headerRows(1)
                .end
        );
        this._pdf.create().open();
    }

    private createProductsTable(product: InvoiceProduct[]): any[][] {
        const tbl: any[][] = [];
        tbl.push([
            'Izstrādājums',
            'skaits',
            new Txt('cena').alignment('right').end,
            new Txt('kopā').alignment('right').end,
        ]);
        for (const prod of product) {
            tbl.push([
                prod._id,
                `${prod.count} gab.`,
                new Txt(`${prod.price.toFixed(2)} EUR`).alignment('right').end,
                new Txt(`${prod.total.toFixed(2)} EUR`).alignment('right').end,
            ]);
        }
        return tbl;
    }

    private createJobsTable(jobs: Job[]): any[][] {
        const tbl: any[][] = [];
        tbl.push([
            // 'nr.',
            'datums',
            'nosaukums',
            'izstrādājums',
            new Txt('skaits').alignment('right').end,
            new Txt('EUR').alignment('right').end,
        ]);
        for (const job of jobs) {
            const prod: JobProduct | undefined = job.products as JobProduct;
            tbl.push([
                // job.jobId,
                moment(job.receivedDate).format('L'),
                job.name,
                prod ? new Txt(prod.name).noWrap().end : '',
                prod ? new Txt(prod.count.toString()).alignment('right').end : '',
                prod ? new Txt((prod.price * prod.count).toFixed(2)).alignment('right').end : '',
            ]);
        }
        return tbl;
    }
}
