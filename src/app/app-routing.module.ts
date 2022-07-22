import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { LoginGuard } from './login/login.guard';
import { MessagesListComponent } from './layout/messaging/messages-list/messages-list.component';
import { AppContainerComponent } from './layout/app-container/app-container.component';
import { UserSettingsComponent } from './login/user-settings/user-settings.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent,
    children: [
      {
        path: '',
        component: MainMenuComponent,
        pathMatch: 'full',
        canActivate: [LoginGuard],
      },
      {
        path: 'user-settings',
        component: UserSettingsComponent,
        canActivate: [LoginGuard],
        canDeactivate: [CanDeactivateGuard],
      },
      {
        path: 'messages',
        component: MessagesListComponent,
        pathMatch: 'full',
        canActivate: [LoginGuard],
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
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // , { enableTracing: true }, , { relativeLinkResolution: 'legacy' }
  exports: [RouterModule]
})
export class AppRoutingModule { }
