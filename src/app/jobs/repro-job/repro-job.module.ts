import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { JobEditModule } from '../job-edit/job-edit.module';
import { SimpleFormModule } from 'src/app/library/simple-form';
import { ReproJobListComponent } from './repro-job-list/repro-job-list.component';
import { ReproJobEditComponent } from './repro-job-edit/repro-job-edit.component';
import { ReproJobResolverService } from './services/repro-job-resolver.service';
import { LibraryModule } from 'src/app/library/library.module';
import { JobFilterComponent } from './side-panel/job-filter/job-filter.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { UploadProgressComponent } from './side-panel/upload-progress/upload-progress.component';
import { JobListComponent } from './repro-job-list/job-list/job-list.component';

@NgModule({
  declarations: [
    ReproJobListComponent, 
    JobFilterComponent,
    ReproJobEditComponent,
    SidePanelComponent,
    UploadProgressComponent,
    JobListComponent,
  ],
  imports: [
    CommonModule,
    MaterialLibraryModule,
    LibraryModule,
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
