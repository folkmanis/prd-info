import { Action, createReducer, on } from '@ngrx/store';
import { CustomersState, Customer, CustomerPartial } from 'src/app/interfaces';
import { CustomersActions } from '../actions';

type CustomerMap = Array<[string, Customer]>;

const initialState: CustomersState = {
    customers: undefined,
    customerMap: [],
    lastInsertId: undefined,
    loading: false,
    error: null,
};

const _reducer = createReducer(
    initialState,
    on(
        CustomersActions.apiRetrievedList,
        (state, action) => ({
            ...state,
            customers: action.customers,
            loading: false,
        })
    ),
    on(
        CustomersActions.apiRetrievedOne,
        (state, { customer }) => ({
            ...state,
            customerMap: updateCustomer(state.customerMap, customer),
            loading: false,
        })
    ),
    on(CustomersActions.apiUpdatedOne),
    on(CustomersActions.apiInsertedOne,
        (state, action) => ({
            ...state,
            lastInsertId: action.id,
        })
    ),
    on(CustomersActions.apiDeletedOne,
        (state, { id }) => ({
            ...state,
            customerMap: deleteCustomer(state.customerMap, id),
            loading: false,
        })
    ),
    on(CustomersActions.getList),
    on(CustomersActions.getOne),
    on(CustomersActions.insertOne),
    on(CustomersActions.updateOne),
    on(CustomersActions.deleteOne),
);

export function customersReducer(state: CustomersState, action: Action) {
    return _reducer(state, action);
}

function updateCustomer(customerMap: CustomerMap, newCustomer: Customer): CustomerMap {
    const customers = new Map(customerMap).set(newCustomer._id, newCustomer);
    return [...customers.entries()];
}

function deleteCustomer(customerMap: CustomerMap, id: string): CustomerMap {
    const customers = new Map(customerMap);
    customers.delete(id);
    return [...customers.entries()];
}
