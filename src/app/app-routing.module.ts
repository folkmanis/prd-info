import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppContainerComponent } from './layout/app-container/app-container.component';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { MessagesListComponent } from './layout/messaging/messages-list/messages-list.component';
import { isLoggedIn } from './login/login.guard';
import { isModuleAllowed } from './login/module.guard';
import { USER_MODULES } from './user-modules';


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
        loadChildren: () => import('./user-settings/user-settings.module').then(m => m.UserSettingsModule),
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
        loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule),
      },
      {
        path: 'jobs-admin',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./jobs-admin/jobs-admin-routes'),
      },
      {
        path: 'calculations',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./calculations/calculations.module').then(m => m.CalculationsModule),
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

routes.find(r => r.path === '')?.children.forEach(c => c.title = USER_MODULES.find(m => m.route === c.path)?.name);

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }, , { relativeLinkResolution: 'legacy' }
  exports: [RouterModule]
})
export class AppRoutingModule { }
