import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsProductionComponent } from './products-production.component';

const routes: Routes = [{ path: '', component: ProductsProductionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsProductionRoutingModule { }
