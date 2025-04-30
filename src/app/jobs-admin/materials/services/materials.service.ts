import { inject, Injectable, Signal } from '@angular/core';
import { Material } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';

export type MaterialWithDescription = Material & {
  catDes: string;
};

export interface MaterialsFilter {
  name?: string;
  categories?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class MaterialsService {
  private api = inject(MaterialsApiService);

  getMaterialsResource(filter?: FilterInput<MaterialsFilter>) {
    return this.api.materialsResource(toFilterSignal(filter));
  }

  getMaterial(id: string): Promise<Material> {
    return this.api.getOne(id);
  }

  getNamesForValidation(): Promise<string[]> {
    return this.api.validatorData('name');
  }

  updateMaterial(material: Partial<Material>): Promise<Material> {
    const { _id: id, ...upd } = material;
    if (!id) {
      throw new Error('id not set');
    }
    return this.api.updateOne(id, upd);
  }

  insertMaterial(material: Partial<Material>): Promise<Material> {
    const { _id, ...data } = material;
    return this.api.insertOne(data);
  }
}
