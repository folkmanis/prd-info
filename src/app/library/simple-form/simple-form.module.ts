import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { LibraryModule } from 'src/app/library';

import { SimpleFormContainerComponent } from './simple-form-container/simple-form-container.component';
import { SimpleFormDirective } from './simple-form.directive';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleListContainerComponent } from './simple-list-container/simple-list-container.component';
import { RouterModule, Routes, provideRoutes } from '@angular/router';
import { SimpleFormModuleConfiguration } from './simple-form-module-configuration';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LibraryModule,
  ],
  declarations: [
    SimpleListContainerComponent,
    SimpleFormContainerComponent,
    SimpleFormDirective,
  ],
  exports: [
    RouterModule,
    SimpleListContainerComponent,
    SimpleFormContainerComponent,
    SimpleFormDirective,
  ]
})
export class SimpleFormModule {
  static forChildren(conf: SimpleFormModuleConfiguration): ModuleWithProviders<SimpleFormModule> {

    return {
      ngModule: SimpleFormModule,
      providers: [
        conf.resolver,
        provideRoutes(this.provideRoute(conf)),
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },

      ]
    };
  }

  private static provideRoute(conf: SimpleFormModuleConfiguration): Routes {
    return [
      {
        path: conf.path,
        component: conf.listComponent,
        children: [
          {
            path: 'new',
            component: conf.editorComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
              value: {},
            },
          },
          {
            path: ':id',
            component: conf.editorComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              value: conf.resolver,
            }
          },
        ]
      }
    ];
  }

}
