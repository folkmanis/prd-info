import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EquipmentPartial } from 'src/app/interfaces';
import { EquipmentService } from '../../equipment/services/equipment.service';

export const resolveEquipmentList: ResolveFn<EquipmentPartial[]> = () => inject(EquipmentService).getList();
