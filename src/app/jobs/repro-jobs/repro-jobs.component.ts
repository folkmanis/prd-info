import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { LayoutService } from 'src/app/services';
import { JobQueryFilter } from '../interfaces';
import { JobService } from '../services/job.service';
import { ReproJobService } from './services/repro-job.service';
import { UploadRefService } from './services/upload-ref.service';


@Component({
  selector: 'app-repro-jobs',
  templateUrl: './repro-jobs.component.html',
  styleUrls: ['./repro-jobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ReproJobsComponent implements OnInit {

  large$ = this.layoutService.isLarge$;
  small$ = this.layoutService.isSmall$;

  jobs$ = this.jobService.jobs$;

  highlited: string | null = null;

  constructor(
    private layoutService: LayoutService,
    private jobService: JobService,
    private router: Router,
    private userFileUpload: UploadRefService,
    private reproJobService: ReproJobService,
  ) { }

  ngOnInit(): void {
  }

  onJobFilter(filter: JobQueryFilter) {
    this.jobService.setFilter(filter);
  }

  onFileDrop(fileList: FileList) {

    if (this.reproJobService.uploadRef) {
      return;
    }

    const name = this.reproJobService.jobNameFromFiles(
      Array.from(fileList).map(file => file.name)
    );
    this.reproJobService.uploadRef = this.userFileUpload.userFileUploadRef(Array.from(fileList));

    this.router.navigate(['jobs', 'repro', 'new', { name }])
      .then(navigated => {
        if (!navigated) this.reproJobService.uploadRef = null;
      });

  }


}
