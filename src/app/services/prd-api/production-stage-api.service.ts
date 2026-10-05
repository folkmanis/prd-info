import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  CreateProductionStage,
  CreateProductionStageSchema,
  pluckDeletedCount,
  ProductionStage,
  ProductionStageList,
  ProductionStageListSchema,
  ProductionStageSchema,
  UpdateProductionStage,
  UpdateProductionStageSchema,
} from 'src/app/interfaces';
import {
  ProductionStagesFilter,
  ProductionStagesFilterSchema,
} from 'src/app/jobs-admin/production-stages/services/production-stages-filter';
import {
  httpFilterSignal,
  httpResponseRequest,
  validateAsync,
  validatePropertyHttp,
  validatorFn,
} from 'src/app/library';
import { cacheable } from 'src/app/library/http/http-options';

@Service()
export class ProductionStageApiService {
  #path = getAppParams('apiPath') + 'production-stages/';
  #http = inject(HttpClient);

  productionStageResource(
    filterSignal: Signal<ProductionStagesFilter | undefined>,
  ): HttpResourceRef<ProductionStageList[] | undefined> {
    const query = httpFilterSignal(ProductionStagesFilterSchema, filterSignal);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(ProductionStageListSchema.array()),
      equal: isEqual,
    });
  }

  getOne(id: string): Observable<ProductionStage> {
    return this.#http.get(this.#path + id, cacheable()).pipe(map(validatorFn(ProductionStageSchema)));
  }

  updateOne(id: string, update: UpdateProductionStage): Promise<ProductionStage> {
    const data = UpdateProductionStageSchema.encode(update);
    const response$ = this.#http.patch(this.#path + id, data);
    return validateAsync(ProductionStageSchema, response$);
  }

  insertOne(create: CreateProductionStage): Promise<ProductionStage> {
    const data = CreateProductionStageSchema.encode(create);
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(ProductionStageSchema, response$);
  }

  deleteOne(id: string): Observable<number> {
    return this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
  }

  validate<K extends keyof Pick<ProductionStage, 'name'>>(schema: SchemaPath<ProductionStage[K]>, key: K): void {
    validatePropertyHttp(this.#path, schema, key, ProductionStageSchema.shape[key]);
  }
}
