import { Route } from '@angular/router';
import { AppContainerComponent } from './layout/app-container/app-container.component';
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { MessagesListComponent } from './layout/messaging/messages-list/messages-list.component';
import { canComponentDeactivate } from './library/guards/can-deactivate.guard';
import { isLoggedIn } from './login/login.guard';
import { isModuleAllowed } from './login/module.guard';

export const APP_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [isLoggedIn],
    children: [
      {
        path: 'user-settings',
        loadComponent: () =>
          import('./user-settings/user-settings.component').then(
            (c) => c.UserSettingsComponent
          ),
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: 'messages',
        component: MessagesListComponent,
        pathMatch: 'full',
      },
      {
        path: 'xmf-search',
        canMatch: [isModuleAllowed],
        loadComponent: () =>
          import('./xmf-search/xmf-search.component').then(
            (c) => c.XmfSearchComponent
          ),
      },
      {
        path: 'xmf-upload',
        canMatch: [isModuleAllowed],
        loadComponent: () =>
          import('./xmf-upload/xmf-upload.component').then(
            (c) => c.XmfUploadComponent
          ),
      },
      {
        path: 'kastes',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./kastes/kastes-routes'),
      },
      {
        path: 'admin',
        canMatch: [isModuleAllowed],
        loadChildren: () => import('./admin/admin-route'),
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
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
