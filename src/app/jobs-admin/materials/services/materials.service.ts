import { Injectable } from '@angular/core';
import { withLatestFrom, BehaviorSubject, combineLatest, EMPTY, map, Observable, switchMap, tap, OperatorFunction, Subject } from 'rxjs';
import { Material, ProductCategory } from 'src/app/interfaces';
import { MaterialsApiService } from 'src/app/services/prd-api/materials-api.service';
import { getConfig } from 'src/app/services/config.provider';


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


  private productCategories$ = getConfig('jobs', 'productCategories');

  reload$ = new Subject<void>();


  constructor(
    private api: MaterialsApiService,
  ) { }

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
      tap(_ => this.reload$.next()),
    );
  }

  insertMaterial(material: Partial<Material>): Observable<Material> {
    delete material._id;
    return this.api.insertOne(material).pipe(
      tap(_ => this.reload$.next()),
    );
  }

  materialsWithDescriptions(filter: MaterialsFilter = {}): Observable<MaterialWithDescription[]> { // : MaterialWithDescription[]
    return this.getMaterials(filter).pipe(
      withLatestFrom(this.productCategories$),
      map(([materials, categories]: [Material[], ProductCategory[]]) => materials.map(
        material => ({
          ...material,
          catDes: categories.find(cat => cat.category === material.category)?.description || ''
        })
      )),
    );
  }


}
