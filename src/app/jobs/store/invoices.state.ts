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

export interface InvoicesTotals {
    productTotals: ProductTotals[];
    grandTotal: number;
}

export interface InvoicesStateModel {
    invoices: Invoice[];
    jobsSelection: number[];
    productTotals: ProductTotals[];
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
    static invoices(state: InvoicesStateModel): Invoice[] {
        return state.invoices;
    }

    @Selector()
    static totals(state: InvoicesStateModel): InvoicesTotals {
        return {
            productTotals: state.productTotals,
            grandTotal: state.productTotals.reduce((acc, curr) => acc + curr.total, 0),
        };
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
}
