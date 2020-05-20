import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KastesMainMenuComponent } from './kastes-main-menu/kastes-main-menu.component';
import { SelectorComponent } from './selector/selector.component';
import { LabelsComponent } from './labels/labels.component';
import { UploadComponent } from './upload/upload.component';
import { PasutijumiComponent } from './pasutijumi/pasutijumi.component';
import { KastesComponent } from './kastes.component';

const routes: Routes = [
  {
    path: '',
    component: KastesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: KastesMainMenuComponent,
      },
      {
        path: 'selector/:id',
        component: SelectorComponent,
      },
      { path: 'selector', redirectTo: 'selector/0', },
      {
        path: 'labels',
        component: LabelsComponent,
      },
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'pasutijumi',
        component: PasutijumiComponent,
      },
    ]
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
