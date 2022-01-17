import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { EMPTY } from 'rxjs';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';

@Injectable({
  providedIn: 'any'
})
export class EquipmentResolverService extends SimpleFormResolverService<Equipment> {

  constructor(
    router: Router,
    private equipmentService: EquipmentService,
  ) {
    super(router);
  }

  retrieveFn: RetrieveFn<Equipment> = (route) => {
    const id: string = route.paramMap.get('id');
    if (!id) {
      return EMPTY;
    }
    return this.equipmentService.getOne(id);
  };


}
