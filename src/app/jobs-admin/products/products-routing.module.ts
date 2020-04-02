import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsComponent } from './products.component';
import { EditComponent } from './edit/edit.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { NewComponent } from './new/new.component';

const routes: Routes = [
  { 
    path: '', 
    component: ProductsComponent ,
    children: [
      {
        path: 'edit',
        component: EditComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'new',
        component: NewComponent,
        canDeactivate: [CanDeactivateGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
