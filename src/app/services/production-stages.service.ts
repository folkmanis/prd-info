import { inject, Injectable, resource, signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { filter, from, Observable, switchMap, toArray } from 'rxjs';
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

  filter = signal<ProductionStagesFilter>({});

  productionStages = resource({
    request: () => this.filter(),
    loader: ({ request }) => this.getProductionStages(request),
    equal: isEqual,
  });

  async getOne(id: string): Promise<ProductionStage> {
    return this.api.getOne(id);
  }

  async insertOne(stage: CreateProductionStage): Promise<ProductionStage> {
    const data = await this.api.insertOne(stage);
    this.productionStages.reload();
    return data;
  }

  async updateOne(stage: UpdateProductionStage): Promise<ProductionStage> {
    const data = this.api.updateOne(stage);
    this.productionStages.reload();
    return data;
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

  async getProductionStages(stagesFilter?: ProductionStagesFilter): Promise<ProductionStage[]> {
    return this.api.getAll(stagesFilter);
  }
}
