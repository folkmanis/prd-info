import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Material } from 'src/app/interfaces';
import { MaterialsFilter } from 'src/app/jobs-admin/materials/services/materials.service';
import { httpResponseRequest, ValidatorService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class MaterialsApiService {
  #path = getAppParams('apiPath') + 'materials/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  materialsResource(filterSignal: Signal<MaterialsFilter>): HttpResourceRef<Material[]> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(Material),
      defaultValue: [],
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Material> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + id, new HttpOptions());
    return this.#validator.validateAsync(Material, data$);
  }

  updateOne(id: string, data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    const data$ = this.#http.patch<Record<string, any>>(this.#path + id, data, new HttpOptions(params));
    return this.#validator.validateAsync(Material, data$);
  }

  insertOne(data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    const data$ = this.#http.put<Record<string, any>>(this.#path, data, new HttpOptions(params));
    return this.#validator.validateAsync(Material, data$);
  }

  validatorData<K extends keyof Material & string>(key: K): Promise<Material[K][]> {
    return firstValueFrom(this.#http.get<Material[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
