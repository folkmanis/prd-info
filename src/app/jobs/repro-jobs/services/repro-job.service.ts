import { Injectable } from '@angular/core';
import { flatten } from 'lodash-es';
import { concatMap, map, BehaviorSubject, forkJoin, from, Observable, of, toArray, filter } from 'rxjs';
import { JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { Job, JobProduct } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { UploadRef } from './upload-ref';
import { JobFilesService } from 'src/app/filesystem';


export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config


@Injectable({
  providedIn: 'root'
})
export class ReproJobService {

  uploadRef: UploadRef | null = null;

  job: Partial<Job> | null = null;

  private readonly _activeProduct = new BehaviorSubject<string | null>(null);

  constructor(
    private productsService: ProductsService,
    private jobService: JobService,
    private jobFilesService: JobFilesService,
  ) { }

  updateJob(jobUpdate: PartialJob, params: { updatePath?: boolean; } = {}): Observable<Job> {

    const { updatePath } = params;

    return this.addProductionStages(jobUpdate).pipe(
      concatMap(job => this.jobService.updateJob(job.jobId, job)),
      concatMap(job => updatePath ? this.updateFilesLocation(job) : of(job))
    );

  }

  createJob(jobUpdate: Omit<Partial<Job>, 'jobId'>) {
    return this.addProductionStages(jobUpdate).pipe(
      concatMap(job => this.jobService.newJob(job)),
    );
  }

  jobNameFromFiles(fileNames: string[]): string {
    return fileNames
      .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
  }

  setActiveProduct(product: string | null) {
    this._activeProduct.next(product);
  }

  activeProducts(): Observable<string | null> {
    return this._activeProduct.asObservable();
  }

  productionStages(products: JobProduct[]): Observable<JobProductionStage[]> {

    return from(products).pipe(
      filter(prod => !!prod?.name),
      concatMap(prod => this.productsService.productionStages(prod.name).pipe(
        concatMap(stages => from(stages)),
        map(stage => ({
          productionStageId: stage.productionStageId,
          fixedAmount: stage.fixedAmount || 0,
          amount: stage.amount * prod.count + stage.fixedAmount,
          productionStatus: 10,
          materials: stage.materials.map(material => ({
            materialId: material.materialId,
            amount: material.amount * stage.amount * prod.count + material.fixedAmount,
            fixedAmount: material.fixedAmount
          }))
        })),
      )),
      toArray(),
    );

  }

  copyToDropFolder(jobFilesPath: string[], dropFolder: string[]): Observable<boolean> {
    return this.jobFilesService.copyJobFolderToDropFolder(jobFilesPath, dropFolder).pipe(
      map(() => true),
    );
  }

  createFolder(jobId: number) {
    return this.jobService.createFolder(jobId);
  }

  private updateFilesLocation(job: Job): Observable<Job> {
    return this.jobFilesService.updateFolderLocation(job.jobId).pipe(
      map(_ => job),
    );
  }

  private addProductionStages<T extends Partial<Job>>(job: T): Observable<T> {
    if (job?.products instanceof Array && job.products.length > 0) {
      return this.productionStages(job.products).pipe(
        map(productionStages => ({
          ...job,
          productionStages,
        })),
      );
    } else {
      return of(job);
    }
  }


}


