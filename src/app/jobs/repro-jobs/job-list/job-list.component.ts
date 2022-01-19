import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { ReplaySubject, Subject } from 'rxjs';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LayoutService } from 'src/app/services';
import { Job, JobPartial, JobProduct } from '../../interfaces';


type JobWithJobProduct = JobPartial & {
  productsObj: Partial<JobProduct>;
};


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  isLarge$ = this.layout.isLarge$;

  dataSource$ = new ReplaySubject<JobWithJobProduct[]>(1);

  @Input() set jobs(value: JobPartial[]) {

    if (!value) {
      return;
    }

    this.dataSource$.next(addProductsInformation(value));

  }

  @Output() statusUpdate = new Subject<Pick<Job, 'jobId' | 'jobStatus'>>();

  constructor(
    private clipboard: ClipboardService,
    private layout: LayoutService,
    private sanitize: SanitizeService,
  ) { }


  ngOnInit(): void {
  }

  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>, event: MouseEvent) {
    this.clipboard.copy(`${jobId}-${this.sanitize.sanitizeFileName(name)}`);
    event.stopPropagation();
  }

  onSetJobStatus(jobId: number, status: number, event: MouseEvent) {
    event.stopPropagation();
    this.statusUpdate.next({
      jobId,
      jobStatus: {
        generalStatus: status,
        timestamp: new Date(),
      }

    });
  }


}


function addProductsInformation(jobs: JobPartial[]): JobWithJobProduct[] {

  return jobs.map(job => ({ ...job, productsObj: productsObj(job.products), }));

}

function productsObj(products: JobProduct | JobProduct[] | undefined): Partial<JobProduct> {
  if (!products) {
    return {
      name: ''
    };
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
