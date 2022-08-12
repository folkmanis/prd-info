import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { from } from 'rxjs';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { JobPartial } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { ReproJobService } from '../services/repro-job.service';
import { UploadRefService } from '../services/upload-ref.service';


@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobListComponent implements OnInit {

  isLarge = false;

  dataSource$ = this.jobService.jobs$;

  @Input('highlitedProduct') highlited: string | null = null;

  constructor(
    private jobService: JobService,
    private router: Router,
    private userFileUpload: UploadRefService,
    private reproJobService: ReproJobService,
    private clipboard: ClipboardService,
    private sanitize: SanitizeService,
  ) { }


  ngOnInit(): void {
  }

  copyJobIdAndName({ name, jobId }: Pick<JobPartial, 'jobId' | 'name'>) {
    this.clipboard.copy(`${jobId}-${this.sanitize.sanitizeFileName(name)}`);
  }

  onSetJobStatus(jobId: number, status: number) {

    this.jobService.updateJob(
      jobId,
      {
        jobStatus: {
          generalStatus: status,
          timestamp: new Date(),
        }
      }
    ).subscribe();
  }

  hasProduct(job: JobPartial, productName: string): boolean {
    return job.products?.some(product => product.name === productName);
  }

  onFileDrop(fileList: FileList) {

    if (this.reproJobService.uploadRef) {
      return;
    }

    const name = this.reproJobService.jobNameFromFiles(
      Array.from(fileList).map(file => file.name)
    );
    const sortedFiles = Array.from(fileList).sort((a, b) => a.size - b.size);

    this.reproJobService.uploadRef = this.userFileUpload.userFileUploadRef(from(sortedFiles));

    this.router.navigate(['jobs', 'repro', 'new', { name }])
      .then(navigated => {
        if (!navigated) this.reproJobService.uploadRef = null;
      });

  }



}
