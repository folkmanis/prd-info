import { createSelector, createFeatureSelector, select } from '@ngrx/store';
import { Observable, pipe } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { StoreState, CustomersState } from 'src/app/interfaces/store';
import { Customer, CustomerPartial } from 'src/app/interfaces';

export const selectCustomers = createFeatureSelector<StoreState, CustomersState>('customers');

export const customers = createSelector(
    selectCustomers,
    (state) => state.customers
);

export const customer = createSelector(
    selectCustomers,
    (state: CustomersState, props: { id: string; }): Customer | undefined => {
        const idCustomer = state.customerMap.find(mapCust => mapCust[0] === props.id);
        return idCustomer ? idCustomer[1] : undefined;
    }
);

export const lastInsertId = createSelector(
    selectCustomers,
    ({ lastInsertId: insert }) => insert
);
