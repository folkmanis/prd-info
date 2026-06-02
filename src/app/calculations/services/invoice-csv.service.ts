import { inject, Injectable } from '@angular/core';
import { format, Locale } from 'date-fns';
import { InvoiceForReport } from 'src/app/interfaces';
import { DATE_FNS_LOCALE } from 'src/app/library/date-services';

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

const REPORT_FIELDS: string[] = ['Datums', 'Klients', 'Numurs', 'Nosaukums', 'Veids', 'Skaits', 'Cena', 'Summa'];

const wrapField: (r: string) => string = (r) => '"' + r + '"';
const stringify = (r: string[][], separator: string): string =>
  r.map((row) => row.map(wrapField).join(separator)).join('\n');

@Injectable({
  providedIn: 'root',
})
export class InvoiceCsvService {
  #locale = inject<Locale>(DATE_FNS_LOCALE, { optional: true });

  csvInvoice(invoice: InvoiceForReport, separator = ','): File {
    const locale = this.#locale ?? undefined;

    const head: string[] = [...DOCUMENT_FIELDS];
    invoice.products.forEach((_, idx) => ITEM_FIELDS.forEach((itm) => head.push(itm + (idx + 1))), []);

    const data: string[] = [
      format(invoice.createdDate, 'P', { locale }),
      invoice.customerInfo?.financial?.clientName || invoice.customer,
      '1',
      invoice.comment || '',
    ];

    const content = stringify(
      [
        head,
        invoice.products.reduce(
          (acc, curr) => [...acc, curr._id, curr.comment || '', curr.count.toFixed(6), curr?.price?.toFixed(6) ?? ''],
          data,
        ),
      ],
      separator,
    );

    return new File([content], `Invoice ${invoice.invoiceId}.csv`, { type: 'text/csv' });
  }

  csvReport(invoice: InvoiceForReport, separator = ','): File {
    const locale = this.#locale ?? undefined;

    const data: string[][] = [REPORT_FIELDS];
    invoice.jobs?.forEach((job) => {
      const row = [
        format(new Date(job.receivedDate), 'P', { locale }),
        invoice.customer,
        job.jobId.toString(),
        job.name,
      ];
      if (job.products instanceof Array) {
        const pr = job.products;
        row.push(
          pr.name,
          pr.count.toFixed(2).replace('.', ','),
          pr.price.toFixed(2).replace('.', ','),
          (pr.count * pr.price).toFixed(2).replace('.', ','),
        );
      }
      data.push(row);
    });
    const content = stringify(data, separator);

    return new File([content], `${invoice.customer}-${invoice.invoiceId}.csv`, { type: 'text/csv' });
  }
}
