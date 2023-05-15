import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LibraryModule } from 'src/app/library/library.module';
import { CacheInterceptorService } from 'src/app/library/http';
import { JobsAdminRoutingModule } from './jobs-admin-routing.module';
import { JobsAdminComponent } from './jobs-admin.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { MaterialsModule } from './materials/materials.module';
import { EquipmentModule } from './equipment/equipment.module';
import { ProductionStagesModule } from './production-stages/production-stages.module';

@NgModule({
  declarations: [
    JobsAdminComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
    MaterialLibraryModule,
    MaterialsModule,
    EquipmentModule,
    ProductionStagesModule,
    JobsAdminRoutingModule,
    MainMenuComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptorService, multi: true, },
  ],
})
export class JobsAdminModule { }
