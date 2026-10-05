import { inject, ResourceRef, Service } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { filter, from, Observable, switchMap, toArray } from 'rxjs';
import {
  CreateProductionStage,
  DropFolder,
  ProductionStage,
  ProductionStageList,
  UpdateProductionStage,
} from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { ProductionStageApiService } from '../../../services/prd-api/production-stage-api.service';
import { ProductionStagesFilter } from './production-stages-filter';

export const newProductionStage = (): ProductionStage => {
  return {
    _id: '',
    name: '',
    description: '',
    equipmentIds: [],
    dropFolders: [],
    disabled: false,
  };
};

@Service()
export class ProductionStagesService {
  private api = inject(ProductionStageApiService);

  getProductionStagesResource(
    filterSignal?: FilterInput<ProductionStagesFilter>,
  ): ResourceRef<ProductionStageList[] | undefined> {
    return this.api.productionStageResource(toFilterSignal(filterSignal));
  }

  getOne(id: string): Observable<ProductionStage> {
    return this.api.getOne(id);
  }

  insertOne(stage: CreateProductionStage): Promise<ProductionStage> {
    return this.api.insertOne(stage);
  }

  updateOne(id: string, update: UpdateProductionStage): Promise<ProductionStage> {
    return this.api.updateOne(id, update);
  }

  validateName(schema: SchemaPath<string>) {
    this.api.validate(schema, 'name');
  }

  getDropFolder(id: string, customerName: string): Observable<DropFolder[]> {
    return this.getOne(id).pipe(
      switchMap((stage) => from(stage.dropFolders)),
      filter((stage) => this.isDefault(stage) || this.#includesCustomer(stage, customerName)),
      toArray(),
    );
  }

  isDefault(dropFolder: DropFolder): boolean {
    return dropFolder.customers.includes('**');
  }

  #includesCustomer(dropFolder: DropFolder, customerName: string): boolean {
    return dropFolder.customers.includes(customerName);
  }
}
