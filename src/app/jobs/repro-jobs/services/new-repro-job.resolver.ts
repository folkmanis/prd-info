import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Job } from 'src/app/jobs/interfaces';
import { ReproJobService } from './repro-job.service';


type NewJob = Partial<Omit<Job, 'jobId'>>;


export const DEFAULT_REPRO_JOB: NewJob = {
  name: '',
  receivedDate: new Date(),
  dueDate: new Date(),
  production: {
    category: 'repro' as const,
  },
  jobStatus: {
    generalStatus: 10,
    timestamp: new Date(),
  }
};


@Injectable({
  providedIn: 'root'
})
export class NewReproJobResolver implements Resolve<NewJob> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): NewJob {

    const job = {
      ...DEFAULT_REPRO_JOB,
    };

    if (route.paramMap.get('name')) {
      job.name = route.paramMap.get('name');
    }

    return job;
  }


}
