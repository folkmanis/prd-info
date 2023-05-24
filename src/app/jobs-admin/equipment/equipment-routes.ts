import { Route } from '@angular/router';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';
import { EquipmentEditComponent } from './equipment-edit/equipment-edit.component';
import { resolveEquipment } from './services/equipment-resolver';

export default [
    {
        path: '',
        component: EquipmentListComponent,
        children: [
            {
                path: 'new',
                component: EquipmentEditComponent,
                data: {
                    equipment: null,
                }
            },
            {
                path: ':id',
                component: EquipmentEditComponent,
                resolve: {
                    equipment: resolveEquipment,
                }
            }
        ]
    }
] as Route[];