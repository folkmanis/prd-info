import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  Material,
  MaterialCreate,
  MaterialCreateSchema,
  MaterialList,
  MaterialListSchema,
  MaterialSchema,
  MaterialUpdate,
  MaterialUpdateSchema,
} from 'src/app/interfaces';
import { MaterialModel, MaterialModelSchema } from 'src/app/jobs-admin/materials/schemas/material-model.schema';
import { MaterialQuerySchema, MaterialsFilter } from 'src/app/jobs-admin/materials/schemas/materials.filter.schema';
import { httpFilterSignal, httpResponseRequest, validatePropertyHttp, validatorFn } from 'src/app/library';

@Service()
export class MaterialsApiService {
  #path = getAppParams('apiPath') + 'materials/';
  #http = inject(HttpClient);

  #materialValdator = map(validatorFn(MaterialSchema));

  materialsResource(filter: Signal<MaterialsFilter | undefined>): HttpResourceRef<MaterialList[] | undefined> {
    const query = httpFilterSignal(MaterialQuerySchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(MaterialListSchema.array()),
      equal: isEqual,
    });
  }

  getOne(id: string): Observable<Material> {
    return this.#http.get(this.#path + id).pipe(this.#materialValdator);
  }

  updateOne(id: string, material: MaterialUpdate): Observable<Material> {
    const data = MaterialUpdateSchema.encode(material);
    return this.#http.patch(this.#path + id, data).pipe(this.#materialValdator);
  }

  insertOne(material: MaterialCreate): Observable<Material> {
    const data = MaterialCreateSchema.encode(material);
    return this.#http.put(this.#path, data).pipe(this.#materialValdator);
  }

  validate<K extends keyof Pick<MaterialModel, 'name'>>(schema: SchemaPath<MaterialModel[K]>, key: K): void {
    validatePropertyHttp(this.#path, schema, key, MaterialModelSchema.shape[key]);
  }
}
