import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, map, Observable, switchMap, tap } from 'rxjs';
import { Material, ProductCategory } from 'src/app/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';

type MaterialWithDescription = Material & {
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

  private filter$ = new BehaviorSubject<MaterialsFilter>({});

  private productCategories$ = getConfig('jobs', 'productCategories');

  materials$ = combineLatest([
    this.filter$.pipe(switchMap(filter => this.api.getAll(filter))),
    this.productCategories$,
  ]).pipe(
    this.addCategoriesDescription()
  );

  constructor(
    private api: MaterialsApiService,
  ) { }

  setFilter(filter: MaterialsFilter = {}) {
    this.filter$.next(filter);
  }

  reload() {
    this.filter$.next(this.filter$.value);
  }

  getMaterials(filter: MaterialsFilter = {}): Observable<Material[]> {
    return this.api.getAll(filter);
  }

  getMaterial(id: string): Observable<Material> {
    return this.api.getOne(id);
  }

  getNamesForValidation(): Observable<string[]> {
    return this.api.validatorData('name');
  }

  updateMaterial(material: Partial<Material>): Observable<Material> {
    const { _id: id, ...upd } = material;
    if (!id) {
      return EMPTY;
    }
    return this.api.updateOne(id, upd).pipe(
      tap(_ => this.reload()),
    );
  }

  insertMaterial(material: Partial<Material>): Observable<Material> {
    delete material._id;
    return this.api.insertOne(material).pipe(
      tap(_ => this.reload()),
    );
  }

  private addCategoriesDescription() { // : MaterialWithDescription[]
    return map(([materials, categories]: [Material[], ProductCategory[]]) => materials.map(
      material => ({
        ...material,
        catDes: categories.find(cat => cat.category === material.category)?.description || ''
      })
    ));
  }


}
