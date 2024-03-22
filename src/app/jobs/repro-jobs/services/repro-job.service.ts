import { Injectable } from '@angular/core';
import { flatten } from 'lodash-es';
import { Observable, firstValueFrom, map } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { Job, JobProduct } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { UploadRef } from './upload-ref';


export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config


@Injectable({
  providedIn: 'root'
})
export class ReproJobService {

  uploadRef: UploadRef | null = null;

  job: Partial<Job> | null = null;


  constructor(
    private productsService: ProductsService,
    private jobService: JobService,
    private jobFilesService: JobFilesService,
  ) { }

  async updateJob(jobUpdate: PartialJob, params: { updatePath?: boolean; } = {}): Promise<Job> {

    const { updatePath } = params;

    const update = await this.addProductionStages(jobUpdate);

    const updatedJob = await this.jobService.updateJob(update.jobId, update);
    if (updatePath) {
      await this.updateFilesLocation(updatedJob);
    }

    return updatedJob;

  }

  async createJob(jobUpdate: Omit<Partial<Job>, 'jobId'>): Promise<Job> {
    const update = await this.addProductionStages(jobUpdate);
    return this.jobService.newJob(update);
  }

  jobNameFromFiles(fileNames: string[]): string {
    return fileNames
      .reduce((acc, curr) => [...acc, curr.replace(/\.[^/.]+$/, '')], [])
      .reduce((acc, curr, _, names) => [...acc, curr.slice(0, MAX_JOB_NAME_LENGTH / names.length)], [])
      .join('_');
  }

  async productionStages(products: JobProduct[] = []): Promise<JobProductionStage[]> {

    const productStages = products.map(async product => {

      if (!product.name) {
        return [];
      }

      const stages = await firstValueFrom(this.productsService.productionStages(product.name));
      return stages.map(stage => this.jobProductionStage(stage, product));
    });
    const allStages = await Promise.all(productStages);
    return flatten(allStages);

  }

  copyToDropFolder(jobFilesPath: string[], dropFolder: string[]): Observable<boolean> {
    return this.jobFilesService.copyJobFolderToDropFolder(jobFilesPath, dropFolder).pipe(
      map(() => true),
    );
  }

  createFolder(jobId: number) {
    return this.jobService.createFolder(jobId);
  }

  private async updateFilesLocation(job: Job): Promise<string[]> {
    return firstValueFrom(this.jobFilesService.updateFolderLocation(job.jobId));
  }

  private async addProductionStages<T extends Partial<Job>>(job: T): Promise<T> {

    if (!Array.isArray(job?.products) || job.products.length === 0) {
      return job;
    }

    const productionStages = await this.productionStages(job.products);
    return {
      ...job,
      productionStages,
    };

  }

  private jobProductionStage(stage: JobProductionStage, product: JobProduct): JobProductionStage {
    return {
      productionStageId: stage.productionStageId,
      fixedAmount: stage.fixedAmount || 0,
      amount: stage.amount * product.count + stage.fixedAmount,
      productionStatus: 10,
      materials: stage
        .materials
        .map(material => ({
          materialId: material.materialId,
          amount: material.amount * stage.amount * product.count + material.fixedAmount,
          fixedAmount: material.fixedAmount
        }))
    };


  }

}
