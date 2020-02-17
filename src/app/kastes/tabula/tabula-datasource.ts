import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { Observable, merge, of, BehaviorSubject, Subscriber, Subscription, Subject, ReplaySubject } from 'rxjs';

import { KastesService } from '../services/kastes.service';
import { Kaste, Totals } from "../services/kaste.class";

/**
 * Data source for the Tabula view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TabulaDataSource extends DataSource<Kaste> {

  totals$: Subject<Totals> = new Subject();

  private data$: BehaviorSubject<Kaste[]>;
  private eventSubscr: Subscription;

  constructor(
    private kastesService: KastesService,
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Kaste[]> {
return this.data$;
  }
  /**
 *  Called when the table is being destroyed. Use this function, to clean up
 * any open connections or free any held resources that were set up during connect.
 */
  disconnect() {
    this.eventSubscr.unsubscribe();
  }

}
