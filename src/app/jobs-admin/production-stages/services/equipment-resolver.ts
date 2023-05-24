import { inject } from '@angular/core';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { ResolveFn } from '@angular/router';
import { Equipment, EquipmentPartial } from 'src/app/interfaces';

export const resolveEquipmentList: ResolveFn<EquipmentPartial[]> = () =>
    inject(EquipmentService).getList();