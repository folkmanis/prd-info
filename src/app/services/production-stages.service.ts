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

  updateOne(id: string, update: UpdateProductionStage): Promise<ProductionStage> {
    assertNotNull(id);
    return this.api.updateOne(id, update);
  }

  newProductionStage(): ProductionStage {
    return {
      _id: '',
      name: '',
      description: '',
      equipmentIds: [],
      dropFolders: [],
    };
  }

  async validateName(value: string): Promise<boolean> {
    value = value.trim().toUpperCase();
    const names = await this.api.validatorData('name');
    return names.every((name) => name.toUpperCase() !== value);
  }

  getDropFolder(id: string, customerName: string): Observable<DropFolder[]> {
    return from(this.getOne(id)).pipe(
      switchMap((stage) => from(stage.dropFolders)),
      filter((stage) => this.isDefault(stage) || this.#includesCustomer(stage, customerName)),
      toArray(),
    );
  }

  newDropFolder(): DropFolder {
    return {
      path: [],
      customers: [],
    };
  }

  isDefault(dropFolder: DropFolder): boolean {
    return dropFolder.customers.includes('**');
  }

  #includesCustomer(dropFolder: DropFolder, customerName: string): boolean {
    return dropFolder.customers.includes(customerName);
  }
}
