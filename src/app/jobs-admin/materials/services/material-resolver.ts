import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Material } from 'src/app/interfaces';
import { resolveCatching } from 'src/app/library/guards';
import { MaterialsService } from './materials.service';

export const resolveMaterial: ResolveFn<Material> = async (route, state) => {
  return resolveCatching(state.url, () => inject(MaterialsService).getMaterial(route.paramMap.get('id')));
};
