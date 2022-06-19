import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleListTypedContainerComponent } from './simple-list-typed-container/simple-list-typed-container.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { LibraryModule } from 'src/app/library/library.module';
import { CanDeactivateGuard } from 'src/app/library/guards/can-deactivate.guard';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { SimpleFormModuleConfiguration } from './simple-form-module-configuration';
import { SimpleFormTypedContainerComponent } from './simple-form-typed-container/simple-form-typed-container.component';
import { SimpleFormTypedLabelDirective } from './simple-form-typed-container/simple-form-typed-label.directive';



@NgModule({
  declarations: [
    SimpleListTypedContainerComponent,
    SimpleFormTypedContainerComponent,
    SimpleFormTypedLabelDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialLibraryModule,
    LibraryModule,
  ],
  exports: [
    RouterModule,
    SimpleListTypedContainerComponent,
    SimpleFormTypedContainerComponent,
    SimpleFormTypedLabelDirective,
  ]
})
export class SimpleFormTypedModule {

  static forChildren<T>(conf: SimpleFormModuleConfiguration<T>): ModuleWithProviders<SimpleFormTypedModule> {

    return {
      ngModule: SimpleFormTypedModule,
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