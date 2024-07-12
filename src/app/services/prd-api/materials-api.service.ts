import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Material } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class MaterialsApiService {
  private path = getAppParams('apiPath') + 'materials/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getOne(id: string): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.get<Record<string, any>>(this.path + id, new HttpOptions()));
  }

  async getAll(params: Record<string, any> = {}): Promise<Material[]> {
    return this.transformer.toInstanceAsync(Material, this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params)));
  }

  async updateOne(id: string, data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions(params)));
  }

  async insertOne(data: Partial<Material>, params?: Record<string, any>): Promise<Material> {
    return this.transformer.toInstanceAsync(Material, this.http.put<Record<string, any>>(this.path, data, new HttpOptions(params)));
  }

  async validatorData<K extends keyof Material & string>(key: K): Promise<Material[K][]> {
    return firstValueFrom(this.http.get<Material[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
