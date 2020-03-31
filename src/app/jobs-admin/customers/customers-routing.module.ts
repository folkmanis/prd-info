import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { CustomersComponent } from './customers.component';
import { EditComponent } from './edit/edit.component';
import { NewComponent } from './new/new.component';


const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
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
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
