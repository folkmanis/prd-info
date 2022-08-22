import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';
import { Material, ProductCategory, SystemPreferences } from 'src/app/interfaces';
import { map, switchMap, tap } from 'rxjs/operators';
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
  providedIn: 'root'
})
export class MaterialsService {

  private filter$ = new BehaviorSubject<MaterialsFilter>({});

  materials$ = combineLatest([
    this.filter$.pipe(switchMap(filter => this.api.getAll({}))),
    this.config$.pipe(map(conf => conf.jobs.productCategories)),
  ]).pipe(
    map(this.addCategoriesDescription)
  );

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private api: MaterialsApiService,
  ) { }

  setFilter(filter: MaterialsFilter | null = null) {
    this.filter$.next(filter || {});
  }

  reload() {
    this.filter$.next(this.filter$.value);
  }

  getMaterials(): Observable<Material[]> {
    return this.api.getAll();
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

  private addCategoriesDescription([materials, categories]: [Material[], ProductCategory[]]): MaterialWithDescription[] {
    return materials.map(
      material => ({
        ...material,
        catDes: categories.find(cat => cat.category === material.category)?.description || ''
      })
    );
  }


}
