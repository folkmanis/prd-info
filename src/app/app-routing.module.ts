import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'xmf-search', loadChildren: () => import('./xmf-search/xmf-search.module').then(m => m.XmfSearchModule) },
  { path: '', redirectTo: 'xmf-search', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
