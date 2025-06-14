import { Injectable, inject } from '@angular/core';
import { flatten } from 'lodash-es';
import { Observable, OperatorFunction, concatMap, distinctUntilChanged, filter, from, map, of, pipe, reduce, switchMap } from 'rxjs';
import { JobFilesService } from 'src/app/filesystem';
import { CustomerProduct, DropFolder, JobProductionStage, JobProductionStageMaterial, Material, ProductProductionStage, ProductProductionStageMaterial } from 'src/app/interfaces';
import { MaterialsService } from 'src/app/jobs-admin/materials/services/materials.service';
import { ProductsService } from 'src/app/services';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { Job, JobFilter, JobProduct } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { FilterInput } from 'src/app/library';

export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

export type JobTemplate = Partial<Omit<Job, 'jobId'>>;

const MAX_JOB_NAME_LENGTH = 100; // TODO take from global config

@Injectable({
  providedIn: 'root',
})
export class ReproJobService {
  #productsService = inject(ProductsService);
  #jobService = inject(JobService);
  #jobFilesService = inject(JobFilesService);
  #stagesService = inject(ProductionStagesService);
  #materialsService = inject(MaterialsService);

  #jobTemplate: JobTemplate | null = null;

  getJobsResource(filterInput: FilterInput<JobFilter>) {
    return this.#jobService.getJobsResource(filterInput);
  }

  setJobTemplate(template: JobTemplate) {
    this.#jobTemplate = template;
  }

  retrieveJobTemplate(): JobTemplate {
    const template = this.#jobTemplate;
    this.#jobTemplate = null;
    return template ?? {};
  }

  async updateJob(jobUpdate: PartialJob): Promise<Job> {
    const update = await this.addProductionStages(jobUpdate);

    return this.#jobService.updateJob(update.jobId, update);
  }

  async createJob(jobUpdate: Omit<Partial<Job>, 'jobId'>): Promise<Job> {
    const update = await this.addProductionStages(jobUpdate);
    return this.#jobService.newJob(update);
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

      const stages = await this.#productsService.productionStages(product.name);
      return await Promise.all(stages.map((stage) => this.jobProductionStage(stage, product)));
    });
    const allStages = await Promise.all(productStages);
    return flatten(allStages);
  }

  async copyToDropFolder(jobFilesPath: string[], dropFolder: string[]): Promise<boolean> {
    try {
      await this.#jobFilesService.copyJobFolderToDropFolder(jobFilesPath, dropFolder);
      return true;
    } catch (error) {
      return false;
    }
  }

  createFolder(jobId: number) {
    return this.#jobService.createFolder(jobId);
  }

  customerProducts(): OperatorFunction<string | null, CustomerProduct[] | null> {
    return pipe(
      distinctUntilChanged(),
      filter(Boolean),
      switchMap((customer) => this.#productsService.productsCustomer(customer)),
    );
  }

  getDropFolders(products?: JobProduct[], customer?: string): Observable<DropFolder[]> {
    if (!products || products.length === 0 || !customer) {
      return of([] as DropFolder[]);
    }
    return from(this.productionStages(products)).pipe(
      switchMap((stages) =>
        from(stages).pipe(
          concatMap((stage) => this.#stagesService.getDropFolder(stage.productionStageId, customer)),
          reduce((acc, value) => [...acc, ...value], [] as DropFolder[]),
        ),
      ),
      map((folders) => this.#dropFolderSort(folders)),
    );
  }

  async updateFilesLocation(jobId: number): Promise<Job> {
    return this.#jobFilesService.updateFolderLocation(jobId);
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

  private async jobProductionStage(stage: ProductProductionStage, product: JobProduct): Promise<JobProductionStage> {
    const fixedAmount = stage.fixedAmount ?? 0;
    const amount = stage.amount * product.count;

    const materials = await Promise.all(stage.materials.map((m) => this.productionStageMaterial(m, product.count)));
    return {
      productionStageId: stage.productionStageId,
      fixedAmount,
      amount,
      productionStatus: 10,
      materials,
    };
  }

  private async productionStageMaterial(stageMaterial: ProductProductionStageMaterial, productCount: number): Promise<JobProductionStageMaterial> {
    const material = await this.#materialsService.getMaterial(stageMaterial.materialId);
    const amount = stageMaterial.amount * productCount;
    const cost = this.getMaterialCost(material, amount + stageMaterial.fixedAmount);
    return {
      materialId: stageMaterial.materialId,
      amount,
      fixedAmount: stageMaterial.fixedAmount,
      cost,
    };
  }

  private getMaterialCost({ prices, fixedPrice }: Material, amount: number): number {
    const price = [...prices].sort((a, b) => b.price - a.price).find((p) => amount >= p.min)?.price ?? 0;
    return price * amount + fixedPrice;
  }

  #dropFolderSort(dropFolders: DropFolder[]): DropFolder[] {
    const sorted = [...dropFolders];
    sorted.sort((a: DropFolder, b: DropFolder) => {
      if (this.#stagesService.isDefault(a)) {
        return 1;
      }
      if (this.#stagesService.isDefault(b)) {
        return -1;
      }
      return 0;
    });
    return sorted;
  }
}
