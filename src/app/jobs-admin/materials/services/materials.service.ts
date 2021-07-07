import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Material } from 'src/app/interfaces';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'any'
})
export class MaterialsService {

  private reload$ = new Subject<void>();

  materials$ = this.reload$.pipe(
    switchMap(_ => this.api.materials.get()),
  );

  constructor(
    private api: PrdApiService,
  ) { }

  reload() {
    this.reload$.next();
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

  updateMaterial(material: Partial<Material>): Observable<boolean> {
    const { _id: id, ...upd } = material;
    if (!id) {
      return EMPTY;
    }
    return this.api.materials.updateOne(id, upd).pipe(
      tap(_ => this.reload())
    );
  }

  insertMaterial(material: Partial<Material>): Observable<string> {
    delete material._id;
    return this.api.materials.insertOne(material).pipe(
      tap(_ => this.reload()),
    ) as Observable<string>;
  }

}
