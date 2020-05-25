import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { StoreState } from 'src/app/interfaces';
import { Customer, CustomerPartial } from 'src/app/interfaces';
import * as actions from '../actions/customers.actions';
import { PrdApiService } from '../../services/index';

@Injectable({
  providedIn: 'root'
})
export class CustomersEffectsService {

  constructor(
    private prdApi: PrdApiService,
    private actions$: Actions,
  ) { }

  getList$ = createEffect(
    () => this.actions$.pipe(
      ofType(
        actions.getList,
        actions.apiUpdatedOne,
        actions.apiInsertedOne,
        actions.apiDeletedOne,
      ),
      switchMap(
        () => this.prdApi.customers.get({ disabled: true }).pipe(
          map((customers: CustomerPartial[]) => actions.apiRetrievedList({ customers }))
        )
      )
    )
  );

  getOne$ = createEffect(
    () => this.actions$.pipe(
      ofType(
        actions.getOne,
        actions.apiInsertedOne,
        actions.apiUpdatedOne,
      ),
      switchMap(
        props => this.prdApi.customers.get(props.id).pipe(
          map(customer => actions.apiRetrievedOne({ customer })),
        )
      )
    )
  );

  insertOne$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.insertOne),
      switchMap(
        props => this.prdApi.customers.insertOne(props.customer).pipe(
          map(id => actions.apiInsertedOne({ id: id.toString() })),
        )
      )
    )
  );

  updateOne$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.updateOne),
      switchMap(
        ({ customer }) => this.prdApi.customers.updateOne(customer._id, customer)
          .pipe(
            filter(success => success),
            map(() => actions.apiUpdatedOne({ id: customer._id })),
          )
      )
    )
  );

  deleteOne$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.deleteOne),
      switchMap(
        ({ id }) => this.prdApi.customers.deleteOne(id.toString()).pipe(
          filter(count => !!count),
          map(() => actions.apiDeletedOne({ id })),
        )
      )
    )
  );


}
