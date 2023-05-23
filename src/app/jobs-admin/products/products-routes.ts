import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductsEditorComponent } from './products-editor/products-editor.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { resolveProduct } from './services/product-resolver';
import { ProductProductionComponent } from './product-production/product-production.component';
import { resolveProductionStages } from './services/production-stages-resolver';
import { resolveMaterial } from './services/materials-resolver';

export default [
    {
        path: '',
        component: ProductsListComponent,
        children: [
            {
                path: 'new',
                component: ProductsEditorComponent,
                canDeactivate: [canComponentDeactivate],
                data: {
                    product: {},
                }
            },
            {
                path: ':id',
                children: [
                    {
                        path: 'production',
                        component: ProductProductionComponent,
                        canDeactivate: [canComponentDeactivate],
                        resolve: {
                            product: resolveProduct,
                            productionStages: resolveProductionStages,
                            materials: resolveMaterial,
                        }
                    },
                    {
                        path: '',
                        component: ProductsEditorComponent,
                        canDeactivate: [canComponentDeactivate],
                        resolve: {
                            product: resolveProduct,
                        }
                    }
                ]
            },
        ]
    }
] as Route[];