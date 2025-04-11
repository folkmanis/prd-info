import { ResolveFn } from '@angular/router';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { inject } from '@angular/core';
import { resolveCatching } from 'src/app/library/guards';
import { notNullOrThrow } from 'src/app/library';

export const resolveEquipment: ResolveFn<Equipment> = (route, state) => {
  const id = notNullOrThrow(route.paramMap.get('id'));
  return resolveCatching(state.url, () => inject(EquipmentService).getOne(id));
};
