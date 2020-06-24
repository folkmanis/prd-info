import {
    Invoice, InvoicesFilter,
    ProductTotals
} from 'src/app/interfaces';

export class SetInvoicesFilter {
    static readonly type = '[Component] Set Invoices Filter';
    constructor(
        public filter: InvoicesFilter,
    ) { }
}

export class RetrieveInvoices {
    static readonly type = '[Component] Retrieve Invoices';
}

export class SetJobSelection {
    static readonly type = '[Selection Component] Selects Jobs';
    constructor(
        public selection: number[],
    ) { }
}

export class UpdateTotals {
    static readonly type = '[Store] Update Totals From API';
}

export class CreateInvoice {
    static readonly type = '[Component] Create New Invoice';
    constructor(
        public customerId: string
    ) { }
}

export class SelectInvoice {
    static readonly type = '[Component] Select Invoice By Id';
    constructor(
        public invoiceId: string,
    ) { }
}
