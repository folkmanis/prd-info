import { Injectable } from '@angular/core';
import { flatten } from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { Job, JobProduct } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { UploadRef } from './upload-ref';
import { UserFileUploadService } from './user-file-upload.service';


export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config


@Injectable({
  providedIn: 'root'
})
export class ReproJobService {

  uploadRef: UploadRef | null = null;

  job: Partial<Job> | null = null;

  private readonly productionStagesFn = (productName: string) => this.productsService.productionStages(productName);

  constructor(
    private productsService: ProductsService,
    private jobService: JobService,
    private userFileUpload: UserFileUploadService,
  ) { }

  updateJob(jobUpdate: PartialJob): Observable<Job> {

    return addProductionStages(jobUpdate, this.productionStagesFn).pipe(
      concatMap(job => this.jobService.updateJob(job.jobId, job))
    );

  }

  createJob(jobUpdate: Omit<Partial<Job>, 'jobId'>) {
    return addProductionStages(jobUpdate, this.productionStagesFn).pipe(
      concatMap(job => this.jobService.newJob(job)),
    );
  }

  jobNameFromFiles(fileNames: string[]): string {
    return fileNames
      .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
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

