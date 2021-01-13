import { NgModule, FactoryProvider, ModuleWithProviders, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { LibraryModule } from 'src/app/library';

import { SimpleFormContainerComponent } from './simple-form-container/simple-form-container.component';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleListContainerComponent } from './simple-list-container/simple-list-container.component';
import { RouterModule, Routes, provideRoutes, Router } from '@angular/router';
import { SimpleFormModuleConfiguration } from './simple-form-module-configuration';
import { SimpleFormLabelDirective } from './simple-form-container/simple-form-label.directive';
import { SimpleFormResolverService, RetrieveFn } from './simple-form-resolver.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LibraryModule,
  ],
  declarations: [
    SimpleListContainerComponent,
    SimpleFormContainerComponent,
    SimpleFormLabelDirective,
  ],
  exports: [
    RouterModule,
    SimpleListContainerComponent,
    SimpleFormContainerComponent,
    SimpleFormLabelDirective,
  ]
})
export class SimpleFormModule {
  static forChildren<T, U>(conf: SimpleFormModuleConfiguration<T, U>): ModuleWithProviders<SimpleFormModule> {

    return {
      ngModule: SimpleFormModule,
      providers: [
        {
          provide: SimpleFormResolverService,
          useFactory: (router: Router, srv: U) => new SimpleFormResolverService(router, conf.retrieveFnFactory(srv)),
          deps: [Router, conf.resolverDeps],
        },
        provideRoutes(this.provideRoute(conf)),
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
      ]
    };
  }

  private static provideRoute<T, U>(conf: SimpleFormModuleConfiguration<T, U>): Routes {
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
              value: SimpleFormResolverService,
            }
          },
        ]
      }
    ];
  }

}
