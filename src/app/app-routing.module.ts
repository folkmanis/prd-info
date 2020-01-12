import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './login/login.guard';
import { AdminGuard } from './login/admin.guard';
import { USER_MODULES } from './user-modules';

const routes: Routes = [
  { path: '', redirectTo: 'xmf-search', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard],
  }
];

for(const mod of USER_MODULES) {
  routes.push({
    path: mod.route,
    canLoad: [LoginGuard],
    loadChildren: () => import(`./${mod.value}/${mod.value}.module`).then(m=>m[mod.moduleClass])
  })
}

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
