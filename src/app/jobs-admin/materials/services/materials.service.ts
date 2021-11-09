import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Material, ProductCategory, SystemPreferences } from 'src/app/interfaces';
import { map, mapTo, pluck, switchMap, tap } from 'rxjs/operators';
import { CONFIG } from 'src/app/services/config.provider';
import { combineLatest } from 'rxjs';

type MaterialWithDescription = Material & {
  catDes: string;
};

export interface MaterialsFilter {
  name?: string;
  categories?: string[];
}

@Injectable({
  providedIn: 'any'
})
export class MaterialsService {

  private filter$ = new BehaviorSubject<MaterialsFilter | null>(null);

  materials$ = combineLatest([
    this.filter$.pipe(switchMap(filter => this.api.materials.get(filter))),
    this.config$.pipe(pluck('jobs', 'productCategories')),
  ]).pipe(
    map(this.addCategoriesDescription)
  );

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private api: PrdApiService,
  ) { }

  setFilter(filter: MaterialsFilter | null = null) {
    this.filter$.next(filter);
  }

  reload() {
    this.filter$.next(this.filter$.value);
  }

  getMaterials(): Observable<Material[]> {
    return this.api.materials.get();
  }

  getMaterial(id: string): Observable<Material> {
    return this.api.materials.get(id);
  }

  getNamesForValidation(): Observable<string[]> {
    return this.api.materials.validatorData('name');
  }

  updateMaterial(material: Partial<Material>): Observable<Material> {
    const { _id: id, ...upd } = material;
    if (!id) {
      return EMPTY;
    }
    return this.api.materials.updateOne(id, upd).pipe(
      tap(_ => this.reload()),
    );
  }

  insertMaterial(material: Partial<Material>): Observable<string> {
    delete material._id;
    return this.api.materials.insertOne(material).pipe(
      tap(_ => this.reload()),
    ) as Observable<string>;
  }

  private addCategoriesDescription([materials, categories]: [Material[], ProductCategory[]]): MaterialWithDescription[] {
    return materials.map(
      material => ({
        ...material,
        catDes: categories.find(cat => cat.category === material.category)?.description || ''
      })
    );
  }


}
