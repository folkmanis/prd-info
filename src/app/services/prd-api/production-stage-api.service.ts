import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CreateProductionStage, pluckDeletedCount, ProductionStage } from 'src/app/interfaces';
import { httpFilterSignal, httpResponseRequest, validateAsync, validatorFn } from 'src/app/library';
import { cacheable } from 'src/app/library/http/http-options';
import { z } from 'zod';

const ProductionStagesFilterSchema = z
  .object({
    name: z.string(),
  })
  .partial();
export type ProductionStagesFilter = z.infer<typeof ProductionStagesFilterSchema>;

@Service()
export class ProductionStageApiService {
  #path = getAppParams('apiPath') + 'production-stages/';
  #http = inject(HttpClient);

  productionStageResource(
    filterSignal: Signal<ProductionStagesFilter | undefined>,
  ): HttpResourceRef<ProductionStage[]> {
    const query = httpFilterSignal(ProductionStagesFilterSchema, filterSignal);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      defaultValue: [],
      parse: validatorFn(ProductionStage.array()),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<ProductionStage> {
    const response$ = this.#http.get(this.#path + id, cacheable());
    return validateAsync(ProductionStage, response$);
  }

  updateOne(id: string, update: Partial<Omit<ProductionStage, '_id'>>): Promise<ProductionStage> {
    const response$ = this.#http.patch(this.#path + id, update);
    return validateAsync(ProductionStage, response$);
  }

  insertOne(data: CreateProductionStage): Promise<ProductionStage> {
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(ProductionStage, response$);
  }

  deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(data$);
  }

  validatorData<K extends keyof ProductionStage & string>(key: K): Promise<ProductionStage[K][]> {
    return firstValueFrom(this.#http.get<ProductionStage[K][]>(this.#path + 'validate/' + key, cacheable()));
  }
}
