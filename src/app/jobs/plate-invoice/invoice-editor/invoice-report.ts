import { PdfMakeWrapper, Table, Columns, Txt, Cell } from 'pdfmake-wrapper';
import { Invoice, InvoiceProduct, Job, JobProduct, Product } from 'src/app/interfaces';
import * as moment from 'moment';

export class InvoiceReport {
    private _pdf: PdfMakeWrapper = new PdfMakeWrapper();
    constructor(
        private _invoice: Invoice,
    ) {
        this._pdf.pageSize('A4');
        this._pdf.pageMargins([30, 30, 30, 30]);
        this._pdf.info({ title: `Report ${_invoice.invoiceId}` });
    }

    open(): void {
        this._pdf.add([
            new Txt(this._invoice.customer + '/' + this._invoice.invoiceId).fontSize(14).bold().end,
        ]);
        this._pdf.add(
            new Table([
                ...this.createProductsTable(this._invoice.products),
                [
                    '',
                    '',
                    new Cell(new Txt('Kopā').bold().alignment('right').end).end,
                    new Cell(new Txt(`${this._invoice.total.toString()} EUR`).bold().end).end,
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
        tbl.push(['Izstrādājums', 'skaits', 'cena', 'kopā']);
        for (const prod of product) {
            tbl.push([
                prod._id,
                `${prod.count} gab.`,
                `${prod.price} EUR`,
                `${prod.total} EUR`
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
            'skaits',
            'EUR',
        ]);
        for (const job of jobs) {
            tbl.push([
                // job.jobId,
                moment(job.receivedDate).format('L'),
                job.name,
                new Txt((job.products as JobProduct).name).noWrap().end,
                (job.products as JobProduct).count,
                (job.products as JobProduct).price * (job.products as JobProduct).count,
            ]);
        }
        return tbl;
    }
}
