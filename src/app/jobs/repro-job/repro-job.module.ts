import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { JobListModule } from '../job-list/job-list.module';
import { JobEditModule } from '../job-edit/job-edit.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ReproJobListComponent } from './repro-job-list/repro-job-list.component';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { ReproJobResolverService } from './services/repro-job-resolver.service';

@NgModule({
  declarations: [ReproJobListComponent, ReproJobEditComponent],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    JobListModule,
    JobEditModule,
    SimpleFormModule.forChildren({
      path: 'repro',
      resolver: ReproJobResolverService,
      listComponent: ReproJobListComponent,
      editorComponent: ReproJobEditComponent,
    })
  ]
})
export class ReproJobModule { }
