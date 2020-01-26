import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectorComponent } from './selector/selector.component';
import { LabelsComponent } from './labels/labels.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  { path: '', redirectTo: '/selector/0', pathMatch: 'full' },
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
  { path: '**', redirectTo: 'selector/0' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
