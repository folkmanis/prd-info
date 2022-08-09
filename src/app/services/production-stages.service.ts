import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, map, switchMap, tap, toArray } from 'rxjs/operators';
import { ProductionStage, CreateProductionStage, UpdateProductionStage, DropFolder } from 'src/app/interfaces';
import { ProductionStageApiService } from './prd-api/production-stage-api.service';

interface ProductionStagesFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductionStagesService {

  private _filter$ = new BehaviorSubject<ProductionStagesFilter>({});

  productionStages$ = this._filter$.pipe(
    switchMap(filter => this.getList(filter)),
  );

  constructor(
    private api: ProductionStageApiService,
  ) { }

  reload() {
    this.setFilter(this._filter$.value);
  }

  setFilter(filter: ProductionStagesFilter) {
    this._filter$.next(filter);
  }

  getOne(id: string): Observable<ProductionStage> {
    return this.api.getOne(id);
  }

  insertOne(stage: CreateProductionStage): Observable<ProductionStage> {
    return (this.api.insertOne(stage)).pipe(
      tap(_ => this.reload()),
    );
  }

  updateOne(stage: UpdateProductionStage): Observable<ProductionStage> {
    return this.api.updateOne(stage).pipe(
      tap(_ => this.reload()),
    );
  }

  names(): Observable<string[]> {
    return this.api.validatorData('name');
  }

  getDropFolder(id: string, customerName: string): Observable<DropFolder[]> {
    return this.getOne(id).pipe(
      switchMap(stage => from(stage.dropFolders)),
      filter(stage => stage.isDefault() || stage.includesCustomer(customerName)),
      toArray(),
    );
  }

  private getList(filter: ProductionStagesFilter | null): Observable<ProductionStage[]> {
    return this.api.getAll(filter);
  }

}
