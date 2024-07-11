import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Material } from 'src/app/interfaces';
import { MaterialsService } from './materials.service';
import { inject } from '@angular/core';

export const resolveMaterial: ResolveFn<Material> = async (route) => {
  const router = inject(Router);
  const materialsService = inject(MaterialsService);
  try {
    return await materialsService.getMaterial(route.paramMap.get('id'));
  } catch (error) {
    const url = router.createUrlTree(['jobs-admin', 'materials']);
    return new RedirectCommand(url);
  }
};
