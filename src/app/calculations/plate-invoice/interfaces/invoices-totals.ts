import { ProductTotals } from 'src/app/interfaces';

export interface InvoicesTotals {
    totals: ProductTotals[];
    grandTotal: number;
}
