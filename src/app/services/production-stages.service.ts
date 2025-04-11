import { inject, Injectable } from '@angular/core';
import { filter, from, Observable, switchMap, toArray } from 'rxjs';
import { CreateProductionStage, DropFolder, ProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { assertNotNull, FilterInput, toFilterSignal } from '../library';
import { ProductionStageApiService } from './prd-api/production-stage-api.service';

interface ProductionStagesFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductionStagesService {
  private api = inject(ProductionStageApiService);

  getProductionStagesResource(filterSignal?: FilterInput<ProductionStagesFilter>) {
    return this.api.productionStageResource(toFilterSignal(filterSignal));
  }

  getOne(id: string): Promise<ProductionStage> {
    return this.api.getOne(id);
  }

  insertOne(stage: CreateProductionStage): Promise<ProductionStage> {
    return this.api.insertOne(stage);
  }

  updateOne({ _id, ...update }: Partial<UpdateProductionStage>): Promise<ProductionStage> {
    assertNotNull(_id);
    return this.api.updateOne(_id, update);
  }

  async validateName(value: string): Promise<boolean> {
    value = value.trim().toUpperCase();
    const names = await this.api.validatorData('name');
    return names.every((name) => name.toUpperCase() !== value);
  }

  getDropFolder(id: string, customerName: string): Observable<DropFolder[]> {
    return from(this.getOne(id)).pipe(
      switchMap((stage) => from(stage.dropFolders)),
      filter((stage) => stage.isDefault() || stage.includesCustomer(customerName)),
      toArray(),
    );
  }
}
