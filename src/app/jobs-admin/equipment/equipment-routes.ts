import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { resolveEquipment } from './services/equipment-resolver';
import { EquipmentService } from './services/equipment.service';

export default [
  {
    path: '',
    component: EquipmentListComponent,
    children: [
      {
        path: 'new',
        component: EquipmentEditComponent,
        resolve: {
          equipment: () => inject(EquipmentService).newEquipment(),
        },
      },
      {
        path: ':id',
        component: EquipmentEditComponent,
        resolve: {
          equipment: resolveEquipment,
        },
      },
    ],
  },
] as Route[];
