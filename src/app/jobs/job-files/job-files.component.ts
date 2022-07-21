import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FileElement, JobFilesService } from 'src/app/filesystem';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, switchMap, Observable, map, filter } from 'rxjs';
import { JobService } from '../services/job.service';
import { log } from 'prd-cdk';

@Component({
  selector: 'app-job-files',
  templateUrl: './job-files.component.html',
  styleUrls: ['./job-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobFilesComponent implements OnInit {

  private jobId$: Observable<number> = this.route.paramMap.pipe(
    map(params => +params.get('jobId')),
    log('id'),
    filter(id => !isNaN(id)),
  );

  private job$ = this.jobId$.pipe(
    switchMap(id => this.jobService.getJob(id)),
  );

  files$: Observable<FileElement[]> = this.jobId$.pipe(
    switchMap(id => this.jobFilesService.listJobFolder(id)),
  );

  pathName$ = this.job$.pipe(
    pluck('files', 'path'),
    map(path => (path || []).join('/'))
  );


  constructor(
    private jobFilesService: JobFilesService,
    private jobService: JobService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }

}
