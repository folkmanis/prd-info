import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppContainerComponent } from './layout/app-container/app-container.component';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { MessagesListComponent } from './layout/messaging/messages-list/messages-list.component';
import { isLoggedIn } from './login/login.guard';
import { isModuleAllowed } from './login/module.guard';
import { canComponentDeactivate } from './library/guards/can-deactivate.guard';


const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [isLoggedIn],
    children: [
      {
        path: 'user-settings',
        loadComponent: () => import('./user-settings/user-settings.component').then(c => c.UserSettingsComponent),
        canDeactivate: [canComponentDeactivate]
      },
      {
        path: 'messages',
        component: MessagesListComponent,
        pathMatch: 'full',
      },
      {
        path: 'xmf-search',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./xmf-search/xmf-search.module').then(m => m.XmfSearchModule),

      },
      {
        path: 'xmf-upload',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./xmf-upload/xmf-upload.module').then(m => m.XmfUploadModule),
      },
      {
        path: 'kastes',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./kastes/kastes.module').then(m => m.KastesModule),
      },
      {
        path: 'admin',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
      },
      {
        path: 'jobs',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./jobs/jobs-routes'),
      },
      {
        path: 'jobs-admin',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./jobs-admin/jobs-admin-routes'),
      },
      {
        path: 'calculations',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./calculations/calculations-routes'),
      },
      {
        path: '',
        component: MainMenuComponent,
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })], // , { enableTracing: true }, , { relativeLinkResolution: 'legacy' }
  exports: [RouterModule]
})
export class AppRoutingModule { }
