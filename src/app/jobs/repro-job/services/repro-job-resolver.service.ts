import { Injectable } from '@angular/core';
import { Route, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form/simple-form-resolver.service';
import { JobBase } from 'src/app/interfaces';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from '../../services/file-upload.service';

@Injectable({
  providedIn: 'any'
})
export class ReproJobResolverService extends SimpleFormResolverService<Partial<JobBase>> {

  constructor(
    router: Router,
    private fileUploadService: FileUploadService,
    private jobsService: JobService,
  ) { super(router); }


  retrieveFn: RetrieveFn<Partial<JobBase>> = (route) => {
    const id = route.paramMap.get('id');
    if (!isNaN(+id)) {
      this.fileUploadService.setFiles([]);
      return this.jobsService.getJob(+id);
    }
    if (id === 'newName') {
      return of({
        name: route.paramMap.get('name'),
        category: 'repro',
        jobStatus: {
          generalStatus: 20
        }  
      });
    }
    return EMPTY;
  };
}
