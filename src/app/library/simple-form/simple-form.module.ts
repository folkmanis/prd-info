import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { LibraryModule } from 'src/app/library';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormContainerComponent } from './simple-form-container/simple-form-container.component';
import { SimpleFormLabelDirective } from './simple-form-container/simple-form-label.directive';
import { SimpleFormModuleConfiguration } from './simple-form-module-configuration';
import { SimpleListContainerComponent } from './simple-list-container/simple-list-container.component';



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
  static forChildren<T>(conf: SimpleFormModuleConfiguration<T>): ModuleWithProviders<SimpleFormModule> {

    return {
      ngModule: SimpleFormModule,
      providers: [
        conf.resolver,
        provideRoutes(this.provideRoute(conf)),
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
      ]
    };
  }

  private static provideRoute<T>(conf: SimpleFormModuleConfiguration<T>): Routes {
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
