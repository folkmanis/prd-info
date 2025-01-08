import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, tap } from 'rxjs';
import { Job } from '../../interfaces';
import { JobService } from '../../services/job.service';
import { parseJobId } from './parse-job-id';
import { JobTemplate, ReproJobService } from './repro-job.service';
import { UploadRefService } from './upload-ref.service';

const defaultReproJob: (template?: Partial<Job>) => JobTemplate = (template) => ({
  name: template?.name ?? '',
  customer: template?.customer ?? null,
  receivedDate: new Date(),
  dueDate: new Date(),
  production: template?.production ?? {
    category: 'repro' as const,
  },
  comment: template ? `[${template.jobId}] ${template.comment ?? ''}` : null,
  customerJobId: template?.customerJobId ?? null,
  jobStatus: {
    generalStatus: 20,
    timestamp: new Date(),
  },
  products: template?.products ?? [],
  files: null,
  productionStages: [],
});

export const newReproJob: ResolveFn<JobTemplate> = (route) => {
  const oldJobId = parseJobId(route.queryParams.copyId);

  if (typeof oldJobId === 'number') {
    const uploadRefService = inject(UploadRefService);

    return inject(JobService)
      .getJob(oldJobId)
      .pipe(
        tap((job) => route.queryParams.copyFiles === 'true' && uploadRefService.setJobFolderCopy(job.jobId, job.files.fileNames ?? [])),
        map((job) => defaultReproJob(job)),
      );
  } else {
    return {
      ...defaultReproJob(),
      ...inject(ReproJobService).retrieveJobTemplate(),
    };
  }
};
