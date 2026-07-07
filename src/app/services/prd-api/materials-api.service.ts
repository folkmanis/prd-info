import { NETWORK_ERROR } from 'src/app/library/http/network-error';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  Material,
  MaterialSchema,
  MaterialList,
  MaterialListSchema,
  MaterialCreate,
  MaterialCreateSchema,
  MaterialUpdate,
  MaterialUpdateSchema,
} from 'src/app/interfaces';
import { MaterialsQuery } from 'src/app/jobs-admin/materials/schemas/materials.filter.schema';
import { httpResponseRequest, ValidationResult, ValidationResultSchema, ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';
import { MaterialModel, MaterialModelSchema } from 'src/app/jobs-admin/materials/schemas/material-model.schema';
import { SchemaPath, validateHttp } from '@angular/forms/signals';

@Service()
export class MaterialsApiService {
  #path = getAppParams('apiPath') + 'materials/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  #materialValdator = map(this.#validator.validatorFn(MaterialSchema));

  materialsResource(filterSignal: Signal<MaterialsQuery>): HttpResourceRef<MaterialList[] | undefined> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(MaterialListSchema),
      equal: isEqual,
    });
  }

  getOne(id: string): Observable<Material> {
    return this.#http.get(this.#path + id, new HttpOptions()).pipe(this.#materialValdator);
  }

  updateOne(id: string, material: MaterialUpdate): Observable<Material> {
    const data = MaterialUpdateSchema.encode(material);
    return this.#http.patch(this.#path + id, data, new HttpOptions()).pipe(this.#materialValdator);
  }

  insertOne(material: MaterialCreate): Observable<Material> {
    const data = MaterialCreateSchema.encode(material);
    return this.#http.put(this.#path, data, new HttpOptions()).pipe(this.#materialValdator);
  }

  validatorData<K extends keyof Material & string>(key: K): Promise<Material[K][]> {
    return firstValueFrom(this.#http.get<Material[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  validate<K extends keyof Pick<MaterialModel, 'name'>>(schema: SchemaPath<MaterialModel[K]>, key: K): void {
    validateHttp(schema, {
      debounce: 300,
      request: ({ value }) => {
        const request = MaterialModelSchema.partial().encode({ [key]: value() });
        return httpResponseRequest(
          this.#path + 'validate/' + key,
          new HttpOptions({ value: request[key] }).cacheable(),
        );
      },
      options: {
        parse: this.#validator.validatorFn(ValidationResultSchema),
      },
      onSuccess: (response: ValidationResult) => {
        if (response.valid === true) {
          return null;
        } else {
          return {
            kind: 'used',
            message: `"${response.value}" jau tiek izmantots!`,
          };
        }
      },
      onError: () => NETWORK_ERROR,
    });
  }
}
