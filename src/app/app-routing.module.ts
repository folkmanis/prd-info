import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';


const routes: Routes = [
  { path: '', redirectTo: 'xmf-search', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'xmf-search',
    loadChildren: () => import('./xmf-search/xmf-search.module').then(m => m.XmfSearchModule),
    canLoad: [LoginGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
