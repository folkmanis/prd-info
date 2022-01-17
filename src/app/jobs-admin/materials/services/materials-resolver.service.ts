import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { EMPTY } from 'rxjs';
import { Material } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';

@Injectable({
  providedIn: 'any'
})
export class MaterialsResolverService extends SimpleFormResolverService<Material> {

  constructor(
    router: Router,
    private materialsService: MaterialsService,
  ) {
    super(router);
  }

  retrieveFn: RetrieveFn<Material> = (route) => {
    const id: string = route.paramMap.get('id');
    if (!id) {
      return EMPTY;
    }
    return this.materialsService.getMaterial(id);
  };



}
