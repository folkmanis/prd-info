import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CreateProductionStage, ProductionStage } from 'src/app/interfaces';
import { httpResponseRequest, ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class ProductionStageApiService {
  #path = getAppParams('apiPath') + 'production-stages/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  productionStageResource(filterSignal: Signal<Record<string, any>>): HttpResourceRef<ProductionStage[]> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: this.#validator.arrayValidatorFn(ProductionStage),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<ProductionStage> {
    const response$ = this.#http.get<Record<string, any>>(this.#path + id, new HttpOptions().cacheable());
    return this.#validator.validateAsync(ProductionStage, response$);
  }

  updateOne(id: string, update: Partial<Omit<ProductionStage, '_id'>>): Promise<ProductionStage> {
    const response$ = this.#http.patch<Record<string, any>>(this.#path + id, update, new HttpOptions());
    return this.#validator.validateAsync(ProductionStage, response$);
  }

  insertOne(data: CreateProductionStage): Promise<ProductionStage> {
    const response$ = this.#http.put<Record<string, any>>(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(ProductionStage, response$);
  }

  deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions()).pipe(map((data) => data.deletedCount));
    return firstValueFrom(data$);
  }

  validatorData<K extends keyof ProductionStage & string>(key: K): Promise<ProductionStage[K][]> {
    return firstValueFrom(this.#http.get<ProductionStage[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
