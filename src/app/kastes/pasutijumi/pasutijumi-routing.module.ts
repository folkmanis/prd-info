import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'pasutijumi',
    children: [
      {
        path: ':id',
        component: PasutijumsIdComponent,
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: '',
        component: PasutijumiTabulaComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasutijumiRoutingModule { }
