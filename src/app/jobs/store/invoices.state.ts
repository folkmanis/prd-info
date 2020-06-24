import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
import { patch, removeItem, insertItem } from '@ngxs/store/operators';
import { Observable, EMPTY } from 'rxjs';
import { tap, map, switchMap, mergeMap } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import {
    Invoice, InvoicesFilter,
    ProductTotals
} from 'src/app/interfaces';
import * as InvoicesActions from './invoices.actions';
import * as moment from 'moment';
moment.locale('lv');

export interface InvoicesTotals {
    productTotals: ProductTotals[];
    grandTotal: number;
}

export type InvoiceTable = Partial<Invoice> & {
    countAll: number,
    totalAll: number,
    createdDateString: string,
};

export interface InvoicesStateModel {
    invoices: Partial<Invoice>[];
    jobsSelection: number[];
    productTotals: ProductTotals[];
    selectedInvoice?: Invoice;
    filter: InvoicesFilter;
}

@State<InvoicesStateModel>({
    name: 'invoices',
    defaults: {
        invoices: [],
        jobsSelection: [],
        productTotals: [],
        filter: {},
    }
})
@Injectable()
export class InvoicesState {
    constructor(
        private prdApi: PrdApiService,
    ) { }

    @Selector()
    static invoices(state: InvoicesStateModel): InvoiceTable[] {
        return state.invoices.map(invoice => ({
            ...invoice,
            ...invoice.products.reduce((acc, curr) => ({
                countAll: acc.countAll + curr.count, totalAll: acc.totalAll + curr.total
            }), { countAll: 0, totalAll: 0 }),
            createdDateString: moment(invoice.createdDate).format('L'),
        }));
    }

    @Selector()
    static totals(state: InvoicesStateModel): InvoicesTotals {
        return {
            productTotals: state.productTotals,
            grandTotal: state.productTotals.reduce((acc, curr) => acc + curr.total, 0),
        };
    }

    @Selector()
    static selectedInvoice(state: InvoicesStateModel): Invoice | undefined {
        return state.selectedInvoice;
    }

    @Action(InvoicesActions.SetJobSelection)
    setJobSelection(ctx: StateContext<InvoicesStateModel>, { selection }: InvoicesActions.SetJobSelection) {
        ctx.patchState({ jobsSelection: selection });
        ctx.dispatch(new InvoicesActions.UpdateTotals());
    }

    @Action(InvoicesActions.UpdateTotals)
    updateTotals(ctx: StateContext<InvoicesStateModel>): Observable<any> {
        const state = ctx.getState();
        return this.prdApi.invoices.getTotals(state.jobsSelection).pipe(
            tap(totals => ctx.patchState({ productTotals: totals }))
        );
    }

    @Action(InvoicesActions.SetInvoicesFilter)
    setInvoicesFilter(ctx: StateContext<InvoicesStateModel>, { filter }: InvoicesActions.SetInvoicesFilter) {
        ctx.patchState({ filter });
        ctx.dispatch(new InvoicesActions.RetrieveInvoices());
    }

    @Action(InvoicesActions.RetrieveInvoices)
    retrieveInvoices(ctx: StateContext<InvoicesStateModel>): Observable<any> {
        const filter = ctx.getState().filter;
        return this.prdApi.invoices.get(filter).pipe(
            tap(invoices => ctx.patchState({ invoices }))
        );
    }

    @Action(InvoicesActions.CreateInvoice)
    createInvoice(ctx: StateContext<InvoicesStateModel>, { customerId }: InvoicesActions.CreateInvoice): Observable<any> {
        const { jobsSelection } = ctx.getState();
        return this.prdApi.invoices.createInvoice({ selectedJobs: jobsSelection, customerId }).pipe(
            switchMap(inv => ctx.dispatch(new InvoicesActions.SelectInvoice(inv.invoiceId))),
        );
    }

    @Action(InvoicesActions.SelectInvoice)
    selectInvoice(ctx: StateContext<InvoicesStateModel>, { invoiceId }: InvoicesActions.SelectInvoice): Observable<any> | void {
        const state = ctx.getState();
        if (state.selectedInvoice?.invoiceId === invoiceId) {
            return;
        }
        return this.prdApi.invoices.get(invoiceId).pipe(
            tap(inv => ctx.patchState({ selectedInvoice: inv }))
        );
    }

}
