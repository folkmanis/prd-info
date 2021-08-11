import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { OperatorFunction, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  isLarge$ = this.layout.isLarge$;

  dataSource$ = this.jobService.jobs$.pipe(
    addProductsInformation(),
  );

  constructor(
    private jobService: JobService,
    private clipboard: ClipboardService,
    private layout: LayoutService,
  ) { }


  ngOnInit(): void {
  }

  copyJobIdAndName(job: Pick<JobBase, 'jobId' | 'name'>, event: MouseEvent) {
    this.clipboard.copy(`${job.jobId}-${job.name}`);
    event.stopPropagation();
  }

  onSetJobStatus(jobId: number, status: number, event: MouseEvent) {
    event.stopPropagation();
    this.jobService.updateJob({
      jobId,
      jobStatus: {
        generalStatus: status,
      }
    }).subscribe();
  }


}

function addProductsInformation(): OperatorFunction<JobBase[], (JobBase & { productsObj: Partial<JobProduct>; })[]> {

  return pipe(
    map(jobs =>
      jobs.map(job => ({ ...job, productsObj: productsObj(job.products), }))
    ),
  );

}

function productsObj(products: JobProduct | JobProduct[] | undefined): Partial<JobProduct> {
  if (!products) {
    return { name: '' };
  }
  if (!(products instanceof Array)) {
    return { ...products };
  }
  if (products.length === 1) {
    return { ...products[0] };
  }
  return {
    name: products.map(prod => prod.name).join(', '),
  };
}
