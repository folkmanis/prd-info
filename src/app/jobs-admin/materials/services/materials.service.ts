import { inject, Service } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { Observable } from 'rxjs';
import { Material, MaterialCreate, MaterialUpdate } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';
import { MaterialModel } from '../schemas/material-model.schema';
import { MaterialsFilter } from '../schemas/materials.filter.schema';

@Service()
export class MaterialsService {
  #api = inject(MaterialsApiService);

  getMaterialsResource(filter?: FilterInput<MaterialsFilter | undefined>) {
    return this.#api.materialsResource(toFilterSignal(filter));
  }

  getMaterial(id: string): Observable<Material> {
    return this.#api.getOne(id);
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
