import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { LoginGuard } from './login/login.guard';
import { USER_MODULES } from './user-modules';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    pathMatch: 'full',
    canActivate: [LoginGuard],
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

for (const mod of USER_MODULES) {
  routes.push({
    path: mod.route,
    canLoad: [LoginGuard],
    loadChildren: () => import(`./${mod.value}/${mod.value}.module`).then(m => m[mod.moduleClass]),
    canActivate: [LoginGuard],
  });
}

routes.push({ path: '**', redirectTo: '' });

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
