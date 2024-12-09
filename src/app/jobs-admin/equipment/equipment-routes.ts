import { Route } from '@angular/router';
import { Equipment } from 'src/app/interfaces';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { resolveEquipment } from './services/equipment-resolver';

export default [
  {
    path: '',
    component: EquipmentListComponent,
    children: [
      {
        path: 'new',
        component: EquipmentEditComponent,
        resolve: {
          equipment: () => new Equipment(),
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
