import { HttpClient, httpResource, HttpResourceRef, HttpResourceRequest } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Material } from 'src/app/interfaces';
import { MaterialsFilter } from 'src/app/jobs-admin/materials/services/materials.service';
import { AppClassTransformerService, httpResponseRequest } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class MaterialsApiService {
  private path = getAppParams('apiPath') + 'materials/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  materialsResource(filterSignal: Signal<MaterialsFilter>): HttpResourceRef<Material[]> {
    return httpResource(() => httpResponseRequest(this.path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: (data: Record<string, any>[]) => this.transformer.plainToInstance(Material, data),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.get<Record<string, any>>(this.path + id, new HttpOptions()));
  }

  updateOne(id: string, data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions(params)));
  }

  insertOne(data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.put<Record<string, any>>(this.path, data, new HttpOptions(params)));
  }

  validatorData<K extends keyof Material & string>(key: K): Promise<Material[K][]> {
    return firstValueFrom(this.http.get<Material[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
