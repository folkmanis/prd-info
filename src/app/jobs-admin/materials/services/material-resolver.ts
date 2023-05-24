import { ResolveFn } from '@angular/router';
import { Material } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';
import { inject } from '@angular/core';

export const resolveMaterial: ResolveFn<Material> = (route) =>
    inject(MaterialsService).getMaterial(route.paramMap.get('id'));