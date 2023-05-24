import { ResolveFn } from '@angular/router';
import { Equipment } from 'src/app/interfaces';
import { EquipmentService } from './equipment.service';
import { inject } from '@angular/core';

export const resolveEquipment: ResolveFn<Equipment> = (route) =>
    inject(EquipmentService).getOne(route.paramMap.get('id'));