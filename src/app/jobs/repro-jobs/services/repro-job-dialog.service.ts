import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { flatten } from 'lodash';
import { forkJoin, Observable, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { JobBase, JobProduct, JobProductionStage } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';
import { ReproJobEditComponent } from '../repro-job-edit/repro-job-edit.component';

export interface DialogData {
  job: Partial<JobBase>;
}

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

  openJob(job: Partial<JobBase>): Observable<Partial<JobBase> | undefined> {

    const config: MatDialogConfig = {
      ...CONFIG,
      autoFocus: !job.customer,
      data: {
        job,
      }
    };

    return this.matDialog
      .open<ReproJobEditComponent, DialogData, JobBase | undefined>(ReproJobEditComponent, config)
      .afterClosed().pipe(
        concatMap(job => addProductionStages(job, this.productionStagesFn)),
      );

  }

  editJob(jobId: number): Observable<boolean> {
    return this.jobService.getJob(jobId).pipe(
      concatMap(job => this.openJob(job)),
      concatMap(data => data ? this.jobService.updateJob(data) : of(false)),
    );
  }


}

function addProductionStages(job: Partial<JobBase>, getStageFn: (productName: string) => Observable<JobProductionStage[]>): Observable<Partial<JobBase>> {
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
      amount: stage.amount * prod.count + stage.fixedAmount,
      productionStatus: 10,
    })))
  ));
}

