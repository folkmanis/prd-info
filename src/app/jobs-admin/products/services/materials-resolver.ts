import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Material } from 'src/app/interfaces';
import { MaterialsService } from 'src/app/jobs-admin/materials/services/materials.service';

export const resolveMaterial: ResolveFn<Material[]> = () =>
    inject(MaterialsService).getMaterials();