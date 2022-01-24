import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { flatten } from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map, mapTo } from 'rxjs/operators';
import { JobProductionStage } from 'src/app/interfaces';
import { Job, JobProduct } from '../../interfaces';
import { ProductsService } from 'src/app/services';
import { JobService } from '../../services/job.service';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';
import { FileUploadEventType, FileUploadMessage, UploadMessageBase } from '../../interfaces/file-upload-message';

export interface DialogData {
  job: Partial<Job>;
  fileUploadProgress?: Observable<FileUploadMessage[]>;
}

export type PartialJob = Pick<Job, 'jobId'> & Partial<Job>;

const CONFIG: MatDialogConfig = {
  autoFocus: false,
  maxHeight: '100vh',
  maxWidth: '100vw',
};

@Injectable({
  providedIn: 'root'
})
export class ReproJobDialogService {

  private readonly productionStagesFn = (productName: string) => this.productsService.productionStages(productName);

  constructor(
    private matDialog: MatDialog,
    private productsService: ProductsService,
    private jobService: JobService,
  ) { }

  openJob(job: Partial<Job>, fileUploadProgress?: Observable<FileUploadMessage[]>): Observable<PartialJob | undefined> {

    const config: MatDialogConfig = {
      ...CONFIG,
      autoFocus: !job.customer,
      data: {
        job,
        fileUploadProgress,
      }
    };

    return this.matDialog
      .open<ReproJobEditComponent, DialogData, PartialJob | undefined>(ReproJobEditComponent, config)
      .afterClosed().pipe(
        concatMap(job => addProductionStages(job, this.productionStagesFn)),
      );

  }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.openJob(job)),
      concatMap(data => data ? this.jobService.updateJob(jobId, data).pipe(mapTo(true)) : of(false)),
    );
  }


}

function addProductionStages(job: PartialJob, getStageFn: (productName: string) => Observable<JobProductionStage[]>): Observable<PartialJob> {
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

