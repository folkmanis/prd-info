import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { Job } from 'src/app/jobs/interfaces';
import { JobService } from '../../services/job.service';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';


const invalidJobIdMessage = (id: any) => `Nepareizs darba numurs ${id}`;
const notFoundMessage = (id: number, err: Error) => `Darbs nr. ${id} nav atrasts. Kļūda ${err.message}`;

@Injectable({
  providedIn: 'root'
})
export class ReproJobResolverService  {

  constructor(
    private jobService: JobService,
    private router: Router,
    private dialog: ConfirmationDialogService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Job | Observable<Job> | Promise<Job> {

    const jobId = +route.paramMap.get('jobId');

    if (isNaN(jobId)) {
      this.router.navigate(['jobs', 'repro']);
      return this.dialog.confirmDataError(invalidJobIdMessage(route.paramMap.get('jobId')));
    }

    return this.jobService.getJob(jobId).pipe(
      catchError(err => {
        this.router.navigate(['jobs', 'repro']);
        return this.dialog.confirmDataError(notFoundMessage(jobId, err));
      })
    );

  }

}
