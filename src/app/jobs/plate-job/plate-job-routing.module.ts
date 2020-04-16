import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlateJobComponent } from './plate-job.component';


const routes: Routes = [
  {
    path: 'plate-job',
    component: PlateJobComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateJobRoutingModule { }
