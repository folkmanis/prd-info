import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Material } from 'src/app/interfaces';
import { resolveCatching } from 'src/app/library/guards';
import { MaterialsService } from './materials.service';
import { notNullOrThrow } from 'src/app/library';

export const resolveMaterial: ResolveFn<Material> = async (route, state) => {
  const id = notNullOrThrow(route.paramMap.get('id'));
  return resolveCatching(state.url, () => inject(MaterialsService).getMaterial(id));
};
