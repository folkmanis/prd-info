import { Injectable, inject } from '@angular/core';
import { flatten } from 'lodash-es';
import { Observable, OperatorFunction, concatMap, distinctUntilChanged, filter, from, map, pipe, reduce, switchMap } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { CustomerProduct, DropFolder, JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { Job, JobProduct } from '../../interfaces';
import { JobService } from '../../services/job.service';

export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

export type JobTemplate = Partial<Omit<Job, 'jobId'>>;

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

@Injectable({
  providedIn: 'root',
})
export class ReproJobService {
  private productsService = inject(ProductsService);
  private jobService = inject(JobService);
  private jobFilesService = inject(JobFilesService);
  private stagesService = inject(ProductionStagesService);

  private jobTemplate: JobTemplate | null = null;

  setJobTemplate(template: JobTemplate) {
    this.jobTemplate = template;
  }

  retrieveJobTemplate(): JobTemplate | null {
    const template = this.jobTemplate;
    this.jobTemplate = null;
    return template;
  }

  async updateJob(jobUpdate: PartialJob): Promise<Job> {
    const update = await this.addProductionStages(jobUpdate);

    return this.jobService.updateJob(update.jobId, update);
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
    const productStages = products.map(async (product) => {
      if (!product.name) {
        return [];
      }

      const stages = await this.productsService.productionStages(product.name);
      return stages.map((stage) => this.jobProductionStage(stage, product));
    });
    const allStages = await Promise.all(productStages);
    return flatten(allStages);
  }

  copyToDropFolder(jobFilesPath: string[], dropFolder: string[]): Observable<boolean> {
    return this.jobFilesService.copyJobFolderToDropFolder(jobFilesPath, dropFolder).pipe(map(() => true));
  }

  createFolder(jobId: number) {
    return this.jobService.createFolder(jobId);
  }

  customerProducts(): OperatorFunction<string | null, CustomerProduct[] | null> {
    return pipe(
      filter((customer) => !!customer),
      distinctUntilChanged(),
      switchMap((customer) => this.productsService.productsCustomer(customer)),
    );
  }

  getDropFolders(products: JobProduct[], customer: string): Observable<DropFolder[]> {
    return from(this.productionStages(products)).pipe(
      switchMap((stages) =>
        from(stages).pipe(
          concatMap((stage) => this.stagesService.getDropFolder(stage.productionStageId, customer)),
          reduce((acc, value) => [...acc, ...value], [] as DropFolder[]),
        ),
      ),
      map((folders) => dropFolderSort(folders)),
    );
  }

  async updateFilesLocation(jobId: number): Promise<string[]> {
    return this.jobFilesService.updateFolderLocation(jobId);
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
      materials: stage.materials.map((material) => ({
        materialId: material.materialId,
        amount: material.amount * stage.amount * product.count + material.fixedAmount,
        fixedAmount: material.fixedAmount,
      })),
    };
  }
}

function dropFolderSort(dropFolders: DropFolder[]): DropFolder[] {
  const sorted = [...dropFolders];
  sorted.sort((a: DropFolder, b: DropFolder) => {
    if (a.isDefault()) {
      return 1;
    }
    if (b.isDefault()) {
      return -1;
    }
    return 0;
  });
  return sorted;
}
