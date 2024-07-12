import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, Observable, switchMap, tap, toArray } from 'rxjs';
import { CreateProductionStage, DropFolder, ProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { ProductionStageApiService } from './prd-api/production-stage-api.service';

interface ProductionStagesFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductionStagesService {
  private api = inject(ProductionStageApiService);

  private _filter$ = new BehaviorSubject<ProductionStagesFilter>({});

  productionStages$ = this._filter$.pipe(switchMap((f) => this.getProductionStages(f)));

  reload() {
    this.setFilter(this._filter$.value);
  }

  setFilter(stagesFilter: ProductionStagesFilter) {
    this._filter$.next(stagesFilter);
  }

  getOne(id: string): Observable<ProductionStage> {
    return this.api.getOne(id);
  }

  insertOne(stage: CreateProductionStage): Observable<ProductionStage> {
    return this.api.insertOne(stage).pipe(tap((_) => this.reload()));
  }

  updateOne(stage: UpdateProductionStage): Observable<ProductionStage> {
    return this.api.updateOne(stage).pipe(tap((_) => this.reload()));
  }

  names(): Observable<string[]> {
    return this.api.validatorData('name');
  }

  getDropFolder(id: string, customerName: string): Observable<DropFolder[]> {
    return this.getOne(id).pipe(
      switchMap((stage) => from(stage.dropFolders)),
      filter((stage) => stage.isDefault() || stage.includesCustomer(customerName)),
      toArray(),
    );
  }

  getProductionStages(stagesFilter?: ProductionStagesFilter): Observable<ProductionStage[]> {
    return this.api.getAll(stagesFilter);
  }
}
