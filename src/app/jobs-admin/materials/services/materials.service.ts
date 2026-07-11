import { computed, inject, Service } from '@angular/core';
import { Material, MaterialCreate, MaterialPrice, MaterialUpdate } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';
import { MaterialQuerySchema, MaterialsFilter } from '../schemas/materials.filter.schema';
import { Observable } from 'rxjs';
import { MaterialModel } from '../schemas/material-model.schema';
import { SchemaPath } from '@angular/forms/signals';

@Service()
export class MaterialsService {
  #api = inject(MaterialsApiService);

  getMaterialsResource(filter?: FilterInput<MaterialsFilter>) {
    const filterSignal = toFilterSignal(filter);
    const query = computed(() => MaterialQuerySchema.encode(filterSignal()));
    return this.#api.materialsResource(query);
  }

  getMaterial(id: string): Observable<Material> {
    return this.#api.getOne(id);
  }

  getNamesForValidation(): Promise<string[]> {
    return this.#api.validatorData('name');
  }

  updateMaterial(id: string, update: MaterialUpdate): Observable<Material> {
    return this.#api.updateOne(id, update);
  }

  insertMaterial(material: MaterialCreate): Observable<Material> {
    return this.#api.insertOne(material);
  }

  isPropertyAvailable<K extends keyof Pick<MaterialModel, 'name'>>(schema: SchemaPath<MaterialModel[K]>, key: K): void {
    this.#api.validate(schema, key);
  }
}
