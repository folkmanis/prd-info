import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XmfUploadComponent } from './xmf-upload.component';


const routes: Routes = [
  { path: '', component: XmfUploadComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XmfUploadRoutingModule { }
