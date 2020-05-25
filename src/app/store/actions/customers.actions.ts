import { createAction, props } from '@ngrx/store';
import { Customer, CustomerPartial } from 'src/app/interfaces';

enum CustomersActionTypes {
    apiRetrievedList = '[API] Retrieved List',
    apiRetrievedOne = '[API] Retrieved One',
    apiUpdatedOne = '[API] Updated One',
    apiInsertedOne = '[API] Inserted One',
    apiDeletedOne = '[API] Deleted One',
    componentRequestedList = '[Component] Requested List',
    componentRequestedOne = '[Component] Requested One',
    componentInsertOne = '[Component] Insert One',
    componentUpdateOne = '[Component] Update One',
    componentDeleteOne = '[Component] Delete One',
}

export const apiRetrievedList = createAction(
    CustomersActionTypes.apiRetrievedList,
    props<{ customers: CustomerPartial[]; }>()
);

export const apiRetrievedOne = createAction(
    CustomersActionTypes.apiRetrievedOne,
    props<{ customer: Customer; }>()
);

export const apiUpdatedOne = createAction(
    CustomersActionTypes.apiUpdatedOne,
    props<{ id: string; }>()
);

export const apiInsertedOne = createAction(
    CustomersActionTypes.apiInsertedOne,
    props<{ id: string; }>()
);

export const apiDeletedOne = createAction(
    CustomersActionTypes.apiDeletedOne,
    props<{ id: string; }>()
);

export const getList = createAction(
    CustomersActionTypes.componentRequestedList
);

export const getOne = createAction(
    CustomersActionTypes.componentRequestedOne,
    props<{ id: string; }>()
);

export const insertOne = createAction(
    CustomersActionTypes.componentInsertOne,
    props<{ customer: Partial<Customer>; }>()
);

export const updateOne = createAction(
    CustomersActionTypes.componentUpdateOne,
    props<{ customer: Partial<Customer>; }>()
);

export const deleteOne = createAction(
    CustomersActionTypes.componentDeleteOne,
    props<{ id: string; }>()
);
