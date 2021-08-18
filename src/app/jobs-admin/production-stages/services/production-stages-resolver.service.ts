import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { EMPTY } from 'rxjs';
import { ProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from './production-stages.service';

@Injectable({
  providedIn: 'any'
})
export class ProductionStagesResolverService extends SimpleFormResolverService<ProductionStage> {

  constructor(
    router: Router,
    private productionStagesService: ProductionStagesService,
  ) {
    super(router);
  }

  retrieveFn: RetrieveFn<ProductionStage> = (route) => {
    const id: string = route.paramMap.get('id');
    if (!id) {
      return EMPTY;
    }
    return this.productionStagesService.getOne(id);
  };


}
