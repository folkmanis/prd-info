import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasutijumiTabulaComponent } from './pasutijumi-tabula/pasutijumi-tabula.component';
import { PasutijumsIdComponent } from './pasutijums-id/pasutijums-id.component';

const routes: Routes = [
  {
    path: 'pasutijumi',
    children: [
      {
        path: ':id',
        component: PasutijumsIdComponent,
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
