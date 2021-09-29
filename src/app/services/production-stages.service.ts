import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ProductionStage } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

interface ProductionStagesFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionStagesService {

  private _filter$ = new BehaviorSubject<ProductionStagesFilter | null>(null);

  productionStages$ = this._filter$.pipe(
    switchMap(filter => this.getList(filter)),
  );

  constructor(
    private api: PrdApiService,
  ) { }

  reload() {
    this.setFilter(this._filter$.value);
  }

  setFilter(filter: ProductionStagesFilter | null) {
    this._filter$.next(filter);
  }

  getOne(id: string): Observable<ProductionStage> {
    return this.api.productionStages.get(id);
  }

  insertOne(equipment: ProductionStage): Observable<ProductionStage> {
    return (this.api.productionStages.insertOne(equipment)).pipe(
      tap(_ => this.reload()),
    );
  }

  updateOne(equipment: ProductionStage): Observable<ProductionStage> {
    const { _id, ...update } = equipment;
    return this.api.productionStages.updateOne(_id, update).pipe(
      tap(resp => resp && this.reload()),
    );
  }

  names(): Observable<string[]> {
    return this.api.productionStages.validatorData('name').pipe(
      tap(_ => this.reload()),
    );
  }


  private getList(filter: ProductionStagesFilter | null): Observable<ProductionStage[]> {
    return this.api.productionStages.get(filter);
  }
}
