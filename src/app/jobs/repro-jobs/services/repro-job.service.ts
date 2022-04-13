import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { flatten } from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, mapTo, pluck } from 'rxjs/operators';
import { JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { Job, JobProduct } from '../../interfaces';
import { FileUploadMessage } from '../../interfaces/file-upload-message';
import { JobService } from '../../services/job.service';


export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;


@Injectable({
  providedIn: 'root'
})
export class ReproJobService {

  private readonly productionStagesFn = (productName: string) => this.productsService.productionStages(productName);

  constructor(
    private productsService: ProductsService,
    private jobService: JobService,
  ) { }

  updateJob(jobUpdate: PartialJob): Observable<Job> {

    return addProductionStages(jobUpdate, this.productionStagesFn).pipe(
      concatMap(job => this.jobService.updateJob(job.jobId, job))
    );

  }

  createJob(jobUpdate: Omit<Job, 'jobId'>) {
    return addProductionStages(jobUpdate, this.productionStagesFn).pipe(
      concatMap(job => this.jobService.newJob(job)),
    );
  }
}


function addProductionStages<T extends Partial<Job>>(job: T, getStageFn: (productName: string) => Observable<JobProductionStage[]>): Observable<T> {
  if (job?.products instanceof Array && job.products.length > 0) {
    return forkJoin(jobStages(job.products, getStageFn)).pipe(
      map(allStages => ({
        ...job,
        productionStages: flatten(allStages),
      })),
    );
  }
  return of(job);
}

function jobStages(products: JobProduct[], getStageFn: (productName: string) => Observable<JobProductionStage[]>): Observable<JobProductionStage[]>[] {
  return products.map(prod => getStageFn(prod.name).pipe(
    map(stages => stages.map(stage => ({
      ...stage,
      fixedAmount: stage.fixedAmount || 0,
      amount: stage.amount * prod.count + stage.fixedAmount,
      productionStatus: 10,
    }))),
  ));
}

