import { computed, inject, Injectable, signal } from '@angular/core';
import { Material } from 'src/app/interfaces';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';


export type MaterialWithDescription = Material & {
  catDes: string;
};

export interface MaterialsFilter {
  name?: string;
  categories?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  private api = inject(MaterialsApiService);

  private productCategories = configuration('jobs', 'productCategories');

  #materials = signal([] as Material[]);

  materials = this.#materials.asReadonly();

  materialsWithDescriptions = computed<MaterialWithDescription[]>(() => {
    const categories = this.productCategories();
    return this.#materials().map(
      material => ({
        ...material,
        catDes: categories.find(cat => cat.category === material.category)?.description || ''
      })
    );
  });


  constructor() {
    this.reload();
  }

  async reload() {
    try {
      this.#materials.set(await this.api.getAll());
    } catch (error) {
      this.#materials.set([]);
    }
  }


  async getMaterials(filter: MaterialsFilter = {}): Promise<Material[]> {
    return this.api.getAll(filter);
  }

  async getMaterial(id: string): Promise<Material> {
    return this.api.getOne(id);
  }

  async getNamesForValidation(): Promise<string[]> {
    return this.api.validatorData('name');
  }

  async updateMaterial(material: Partial<Material>): Promise<Material> {
    const { _id: id, ...upd } = material;
    if (!id) {
      throw new Error('id not set');
    }
    const data = await this.api.updateOne(id, upd);
    await this.reload();
    return data;
  }

  async insertMaterial(material: Partial<Material>): Promise<Material> {
    delete material._id;
    const data = await this.api.insertOne(material);
    await this.reload();
    return data;
  }



}
