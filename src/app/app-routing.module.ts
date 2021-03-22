import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { LoginGuard } from './login/login.guard';

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
  {
    path: 'xmf-search',
    canLoad: [LoginGuard],
    loadChildren: () => import('./xmf-search/xmf-search.module').then(m => m.XmfSearchModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'xmf-upload',
    canLoad: [LoginGuard],
    loadChildren: () => import('./xmf-upload/xmf-upload.module').then(m => m.XmfUploadModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'kastes',
    canLoad: [LoginGuard],
    loadChildren: () => import('./kastes/kastes.module').then(m => m.KastesModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'admin',
    canLoad: [LoginGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'jobs',
    canLoad: [LoginGuard],
    loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'jobs-admin',
    canLoad: [LoginGuard],
    loadChildren: () => import('./jobs-admin/jobs-admin.module').then(m => m.JobsAdminModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'calculations',
    canLoad: [LoginGuard],
    loadChildren: () => import('./calculations/calculations.module').then(m => m.CalculationsModule),
    canActivate: [LoginGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })], // , { enableTracing: true }
  exports: [RouterModule]
})
export class AppRoutingModule { }
