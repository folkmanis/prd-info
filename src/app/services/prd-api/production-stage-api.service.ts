import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CreateProductionStage, ProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class ProductionStageApiService {
  private path = getAppParams('apiPath') + 'production-stages/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getAll(params: Record<string, any> = {}): Promise<ProductionStage[]> {
    const response$ = this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params).cacheable());
    return this.transformer.toInstanceAsync(ProductionStage, response$);
  }

  async getOne(id: string): Promise<ProductionStage> {
    const response$ = this.http.get<Record<string, any>>(this.path + id, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(ProductionStage, response$);
  }

  async updateOne({ _id, ...data }: UpdateProductionStage): Promise<ProductionStage> {
    const response$ = this.http.patch<Record<string, any>>(this.path + _id, data, new HttpOptions());
    return this.transformer.toInstanceAsync(ProductionStage, response$);
  }

  async insertOne(data: CreateProductionStage): Promise<ProductionStage> {
    const response$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(ProductionStage, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const data = await firstValueFrom(this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()));
    return data.deletedCount;
  }

  async validatorData<K extends keyof ProductionStage & string>(key: K): Promise<ProductionStage[K][]> {
    return firstValueFrom(this.http.get<ProductionStage[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
