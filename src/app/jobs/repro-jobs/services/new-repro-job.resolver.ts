import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Job } from 'src/app/jobs/interfaces';
import { ReproJobService } from './repro-job.service';


type NewJob = Partial<Omit<Job, 'jobId'>>;


const defaultReproJob: () => NewJob = () => ({
  name: '',
  receivedDate: new Date(),
  dueDate: new Date(),
  production: {
    category: 'repro' as const,
  },
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  }
});


@Injectable({
  providedIn: 'root'
})
export class NewReproJobResolver  {

  constructor(
    private reproJobService: ReproJobService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): NewJob {

    const serviceJob = this.reproJobService.job || {};

    const job = {
      ...defaultReproJob(),
      ...serviceJob,
    };

    if (route.paramMap.get('name')) {
      job.name = route.paramMap.get('name');
    }

    if (route.paramMap.get('customer')) {
      job.customer = route.paramMap.get('customer');
    }

    this.reproJobService.job = null;

    return job;
  }


}
