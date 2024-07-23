import { ResolveFn } from '@angular/router';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { inject } from '@angular/core';
import { resolveCatching } from 'src/app/library/guards';

export const resolveEquipment: ResolveFn<Equipment> = (route, state) => {
  return resolveCatching(state.url, () => inject(EquipmentService).getOne(route.paramMap.get('id')));
};
